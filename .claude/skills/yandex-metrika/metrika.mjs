#!/usr/bin/env node
/**
 * Выгрузка данных из Яндекс.Метрики через Stat API v1.
 *
 * Запуск (токен из .env или env-переменной):
 *   node .claude/skills/yandex-metrika/metrika.mjs
 *   node .claude/skills/yandex-metrika/metrika.mjs --days 7
 *   node .claude/skills/yandex-metrika/metrika.mjs --report sources
 *   npm run metrika -- --report geo --days 7
 *
 * Токен (scope metrika:read) кладётся в .env как YANDEX_METRIKA_TOKEN=... (.env в .gitignore).
 * Counter ID — env METRIKA_COUNTER_ID или дефолт 92637429 (active в layouts/default.vue).
 */

import { readFileSync } from 'node:fs';

// Лёгкая загрузка .env из корня проекта (без зависимостей).
// Не перезатирает уже заданные process.env.
function loadEnv() {
  for (const path of ['.env', new URL('../../../.env', import.meta.url).pathname]) {
    try {
      for (const line of readFileSync(path, 'utf8').split('\n')) {
        const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) {
          process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
      }
      return;
    } catch { /* нет .env — ок, читаем из env */ }
  }
}
loadEnv();

const TOKEN = process.env.YANDEX_METRIKA_TOKEN;
const COUNTER_ID = process.env.METRIKA_COUNTER_ID || '92637429';
const API = 'https://api-metrika.yandex.net/stat/v1/data';

// --- args ---
const args = process.argv.slice(2);
const getArg = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};
const days = parseInt(getArg('days', '30'), 10);
const report = getArg('report', 'all'); // all | overview | sources | search | pages | geo

if (!TOKEN) {
  console.error('❌ Не задан YANDEX_METRIKA_TOKEN.');
  console.error('   Добавьте в .env:  YANDEX_METRIKA_TOKEN=y0_...');
  console.error('   Или разово:       YANDEX_METRIKA_TOKEN=y0_... npm run metrika');
  process.exit(1);
}

const date2 = new Date();
const date1 = new Date(Date.now() - days * 86400_000);
const fmt = (d) => d.toISOString().slice(0, 10);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Глобальный лимитер: не чаще 1 запроса в ~1.1с — Метрика троттлит бурсты
// и маскирует это под 400 "Query is too complicated".
let lastCall = 0;
const MIN_GAP = 1100;
async function throttle() {
  const wait = lastCall + MIN_GAP - Date.now();
  if (wait > 0) await sleep(wait);
  lastCall = Date.now();
}

/**
 * Базовый запрос к Stat API.
 * Метрика периодически отдаёт 400 "Query is too complicated" даже на лёгких
 * запросах (интермиттентный троттлинг по частоте). Тот же запрос проходит при
 * повторе — ретраим с растущим бэкоффом.
 */
async function query(params, attempt = 0) {
  const url = new URL(API);
  url.searchParams.set('ids', COUNTER_ID);
  url.searchParams.set('date1', fmt(date1));
  url.searchParams.set('date2', fmt(date2));
  url.searchParams.set('accuracy', process.env.METRIKA_ACCURACY || 'low');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  await throttle();
  const res = await fetch(url, { headers: { Authorization: `OAuth ${TOKEN}` } });
  if (res.ok) return res.json();

  const body = await res.text();
  const tooComplicated = body.includes('too complicated');
  const rateLimited = res.status === 429;
  if ((tooComplicated || rateLimited) && attempt < 8) {
    await sleep(1500 * (attempt + 1));
    return query(params, attempt + 1);
  }
  throw new Error(`API ${res.status}: ${body.slice(0, 300)}`);
}

const num = (n) => new Intl.NumberFormat('ru').format(Math.round(n));
const pct = (n) => `${(n).toFixed(1)}%`;
const sec = (n) => `${Math.floor(n / 60)}м ${Math.round(n % 60)}с`;

function section(title) {
  console.log(`\n${'─'.repeat(60)}\n  ${title}\n${'─'.repeat(60)}`);
}

async function overview() {
  section(`Обзор за ${days} дн. (${fmt(date1)} → ${fmt(date2)})`);
  const d = await query({
    metrics: 'ym:s:visits,ym:s:users,ym:s:pageviews,ym:s:bounceRate,ym:s:pageDepth,ym:s:avgVisitDurationSeconds',
  });
  const t = d.totals;
  console.log(`  Визиты:            ${num(t[0])}`);
  console.log(`  Посетители:        ${num(t[1])}`);
  console.log(`  Просмотры:         ${num(t[2])}`);
  console.log(`  Отказы:            ${pct(t[3])}`);
  console.log(`  Глубина:           ${t[4].toFixed(2)} стр/визит`);
  console.log(`  Ср. время:         ${sec(t[5])}`);
}

async function sources() {
  section('Источники трафика');
  const d = await query({
    metrics: 'ym:s:visits,ym:s:users',
    dimensions: 'ym:s:lastsignTrafficSource',
    sort: '-ym:s:visits',
    limit: '10',
  });
  for (const row of d.data) {
    console.log(`  ${(row.dimensions[0].name || '—').padEnd(28)} ${num(row.metrics[0]).padStart(8)} визитов`);
  }
}

async function search() {
  section('Поисковые системы');
  const se = await query({
    metrics: 'ym:s:visits',
    dimensions: 'ym:s:searchEngineName',
    sort: '-ym:s:visits',
    limit: '10',
  });
  for (const row of se.data) {
    console.log(`  ${(row.dimensions[0].name || '—').padEnd(28)} ${num(row.metrics[0]).padStart(8)} визитов`);
  }

  section('Поисковые запросы (топ-20)');
  const ph = await query({
    metrics: 'ym:s:visits',
    dimensions: 'ym:s:searchPhrase',
    sort: '-ym:s:visits',
    limit: '20',
  });
  if (!ph.data.length) {
    console.log('  (нет данных — Яндекс часто скрывает запросы; смотрите Вебмастер)');
  }
  for (const row of ph.data) {
    console.log(`  ${(row.dimensions[0].name || '—').padEnd(40)} ${num(row.metrics[0]).padStart(6)}`);
  }
}

async function pages() {
  section('Топ страниц входа (landing)');
  const d = await query({
    metrics: 'ym:s:visits,ym:s:bounceRate',
    dimensions: 'ym:s:startURLPathFull',
    sort: '-ym:s:visits',
    limit: '20',
  });
  for (const row of d.data) {
    const path = (row.dimensions[0].name || '—').slice(0, 45);
    console.log(`  ${path.padEnd(46)} ${num(row.metrics[0]).padStart(6)} виз  ${pct(row.metrics[1]).padStart(6)} отказы`);
  }
}

async function geo() {
  section('География (топ городов)');
  const d = await query({
    metrics: 'ym:s:visits',
    dimensions: 'ym:s:regionCity',
    sort: '-ym:s:visits',
    limit: '10',
  });
  for (const row of d.data) {
    console.log(`  ${(row.dimensions[0].name || '—').padEnd(28)} ${num(row.metrics[0]).padStart(8)} визитов`);
  }
}

const reports = { overview, sources, search, pages, geo };

try {
  console.log(`Counter: ${COUNTER_ID}`);
  if (report === 'all') {
    for (const fn of Object.values(reports)) await fn();
  } else if (reports[report]) {
    await reports[report]();
  } else {
    console.error(`Неизвестный отчёт: ${report}. Доступны: ${Object.keys(reports).join(', ')}, all`);
    process.exit(1);
  }
  console.log('');
} catch (e) {
  console.error(`\n❌ ${e.message}`);
  process.exit(1);
}
