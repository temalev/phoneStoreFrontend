/**
 * База для запросов к API.
 *
 * На сервере — внутренний адрес бэкенда по docker-сети (`NUXT_API_INTERNAL`,
 * например `http://phonestorebackend:3000`): один хоп вместо связки
 * DNS → выход наружу → hairpin NAT → TLS. Каждое из этих звеньев — отдельная
 * точка отказа, и DNS в ней уже ломался в августе 2026, уронив выдачу.
 *
 * В браузере — только публичный адрес: имя контейнера снаружи не резолвится.
 *
 * Если внутренний адрес не задан, откатываемся на публичный — поведение
 * такое же, как до правки. Ошибка конфигурации не должна ронять сайт.
 */
export function useApiBase(): string {
  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig();

  // Хвостовой слэш приезжает из NUXT_PUBLIC_URL в compose и даёт двойной
  // слэш в собранном URL. Срезаем, чтобы склейка была предсказуемой.
  const stripSlash = (v: unknown) => String(v || '').replace(/\/+$/, '');

  const publicBase = stripSlash(config.public.URL);

  // На клиенте приватной части конфига не существует — там её просто нет
  // в payload, и обращаться к ней бессмысленно.
  if (!process.server) return publicBase;

  return stripSlash((config as Record<string, unknown>).apiInternal) || publicBase;
}
