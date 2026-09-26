/**
 * Бренд товара — `<vendor>` в фиде Яндекс Товаров и `brand` в разметке `Product`.
 *
 * Раньше карточка брала бренд из таблицы по имени категории с ключами
 * «iPhone», «iPad», «PlayStation 5», а API отдаёт «Iphone», «Ipad», «PS5».
 * Совпадали только Mac, Watch, AirPods, Samsung и Dyson, остальные товары
 * получали брендом имя категории: «Iphone», «Адаптеры питания и кабели
 * для зарядки». Теперь бренд ищется в названии, по линейке и только
 * в последнюю очередь по категории — причём по uuid, а не по имени.
 *
 * Типы в JSDoc, а не аннотациями — как в соседних composables.
 */

/** Бренды, которые пишутся в названиях товаров как есть. */
const BRANDS = [
  'Apple', 'Samsung', 'Dyson', 'Sony', 'Canon', 'Whoop',
  'JBL', 'Xiaomi', 'Marshall', 'DJI', 'Dreame',
];

/** Линейки, по которым бренд узнаётся без его упоминания в названии. */
const FAMILIES = [
  [/iPhone|iPad|MacBook|iMac|AirPods|AirTag|MagSafe|Lightning|Magic (Mouse|Keyboard)/i, 'Apple'],
  [/PlayStation|DualSense/i, 'Sony'],
  [/Galaxy/i, 'Samsung'],
];

/** Последний довод, когда название молчит: «Watch SE 2», «Phone 17». */
const CATEGORY_BRANDS = {
  '49097885-2d30-4c88-bc26-eb7db2c6d841': 'Apple', // iPhone
  '50041b06-4eb0-45c8-8c87-bdf0049b4aa7': 'Apple', // iPad
  '548606d6-5836-4e0f-b93e-4e772ca22076': 'Apple', // Mac
  '4f3c7659-6cb4-4db9-93ec-a8975d681a20': 'Apple', // Watch
  'c22124cd-f6f0-4e4a-b898-c1606f1c8e25': 'Apple', // AirPods
  'ccc52d81-7c9c-4619-87ff-6ed7e363fea2': 'Samsung',
  'b735980b-2c69-4450-bfac-69dd7ee60e44': 'Dyson',
  '12411ad6-f511-4812-b7a3-b3e41de95a64': 'Sony', // PlayStation
  'c568e1fd-4206-422d-aa73-a8e448fe5690': 'Canon',
  'd53d2d22-5d38-4651-8da2-1076f06d6511': 'Whoop',
};

/**
 * Есть ли в тексте слово целиком (без учёта регистра).
 * @param {string} text
 * @param {string} word
 * @returns {boolean}
 */
export function hasWord(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'iu').test(text);
}

/**
 * Бренд товара или null, если его не удалось определить.
 * @param {object} product товар из API
 * @returns {string|null}
 */
export function productBrand(product) {
  const name = product?.name ?? '';

  // Первый по порядку бренд в названии: «Sony DualSense для PlayStation 5» — Sony.
  const named = BRANDS
    .filter((brand) => hasWord(name, brand))
    .sort((a, b) => name.toLowerCase().indexOf(a.toLowerCase())
      - name.toLowerCase().indexOf(b.toLowerCase()))[0];
  if (named) return named;

  const family = FAMILIES.find(([pattern]) => pattern.test(name));
  if (family) return family[1];

  const categoryUuid = product?.categoryUUID ?? product?.category?.uuid;
  return CATEGORY_BRANDS[categoryUuid] ?? null;
}
