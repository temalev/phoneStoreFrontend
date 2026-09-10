// Номер счётчика продублирован из layouts/default.vue, где инициализируется тег.
// Держать его тут константой безопаснее, чем передавать через runtimeConfig:
// счётчик один и меняется примерно никогда, а лишняя косвенность мешает читать.
export const METRIKA_COUNTER_ID = 92637429;

/**
 * Отправляет достижение цели в Яндекс.Метрику.
 *
 * Молча ничего не делает на сервере и до загрузки тега: цель — вещь
 * необязательная, ронять из-за неё интерфейс нельзя.
 *
 * @param {string} goal идентификатор цели (совпадает с условием в кабинете)
 * @param {object} [params] произвольные параметры визита
 */
export function reachGoal(goal, params) {
  if (!import.meta.client) return;
  const { ym } = window;
  if (typeof ym !== 'function') return;
  try {
    ym(METRIKA_COUNTER_ID, 'reachGoal', goal, params);
  } catch (e) {
    // Блокировщики рекламы вырезают тег — это норма, не повод шуметь в консоль.
  }
}
