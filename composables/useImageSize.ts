/**
 * Собственные размеры статических изображений из public/images.
 *
 * Нужны для атрибутов width/height: без них браузер не знает пропорций
 * картинки до загрузки, резервирует нулевую высоту и страница «прыгает».
 * Это Cumulative Layout Shift — Core Web Vital, влияющий на ранжирование.
 *
 * Карта лежит в одном месте, потому что одни и те же изображения категорий
 * перечислены в трёх списках (stores/categories.js, pages/other/index.vue,
 * pages/accessories/index.vue) — дублировать размеры по ним значит гарантированно
 * их рассинхронить.
 *
 * Сгенерировано из public/images: sips -g pixelWidth -g pixelHeight.
 * При замене файла обновить строку, иначе браузер зарезервирует не ту высоту.
 */
export const IMAGE_SIZES = {
  '/images/accessories.webp': [496, 503],
  '/images/airpods.webp': [2762, 1660],
  '/images/applecare.webp': [778, 557],
  '/images/blog/17e.webp': [2640, 1486],
  '/images/blog/hard-reset.webp': [1242, 845],
  '/images/blog/macbook-2026.webp': [1262, 580],
  '/images/blog/pervyy-iphone-fakty.webp': [5120, 2876],
  '/images/blog/quartz.webp': [5120, 3412],
  '/images/blog/rezhim-modema-iphone-nastroyka.webp': [1280, 640],
  '/images/blog/water.webp': [760, 507],
  '/images/buy.webp': [361, 252],
  '/images/cable.webp': [800, 672],
  '/images/camera.webp': [1080, 1080],
  '/images/case.webp': [1420, 834],
  '/images/cost.webp': [2524, 791],
  '/images/credit.webp': [5120, 1138],
  '/images/delivery.webp': [479, 263],
  '/images/dji.webp': [994, 1020],
  '/images/dreame.webp': [994, 1020],
  '/images/dyson.webp': [1548, 1080],
  '/images/ipad.webp': [800, 738],
  '/images/iphone.webp': [863, 628],
  '/images/jbl.webp': [994, 1020],
  '/images/left_hand_tradein.webp': [2523, 894],
  '/images/mac.webp': [960, 881],
  '/images/mainPageBackground.webp': [2760, 1120],
  '/images/marshall.webp': [994, 1020],
  '/images/mouse.webp': [1144, 1144],
  '/images/oldTech.webp': [1973, 1018],
  '/images/oldTech_mobile.webp': [1973, 1018],
  '/images/other.webp': [960, 746],
  '/images/pay.webp': [1200, 1200],
  '/images/ps.webp': [1200, 662],
  '/images/right_hand_tradein.webp': [2523, 894],
  '/images/rk.png': [2001, 2001],
  '/images/rk_service.webp': [3160, 1486],
  '/images/samsung.webp': [815, 474],
  '/images/tradein_mobile.webp': [2523, 894],
  '/images/watchCard.webp': [800, 843],
  '/images/whoop.webp': [480, 642],
  '/images/xiaomi.webp': [994, 1020],
  '/images/yandex.webp': [398, 408],
};

/**
 * Атрибуты width/height для статического изображения.
 * Для неизвестного пути возвращает пустой объект — тег остаётся как был.
 * @param {string} src путь вида «/images/iphone.webp»
 * @returns {{ width?: number, height?: number }}
 */
export function imageSize(src) {
  const size = IMAGE_SIZES[src];
  return size ? { width: size[0], height: size[1] } : {};
}
