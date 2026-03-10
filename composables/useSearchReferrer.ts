/**
 * Определяет, пришёл ли пользователь из поисковика, и извлекает поисковый запрос из referrer.
 * Работает только на клиенте (document.referrer).
 */
const SEARCH_PARAMS: Record<string, string> = {
  'google.': 'q',
  'yandex.': 'text',
  'bing.': 'q',
  'mail.ru': 'q',
  'duckduckgo.': 'q',
  'ya.': 'text',
};

export function useSearchReferrer() {
  let isFromSearch = false;
  let searchQuery = '';
  let searchEngine = '';

  if (import.meta.client && typeof document !== 'undefined') {
    const ref = document.referrer || '';
    const lower = ref.toLowerCase();

    for (const [domain, param] of Object.entries(SEARCH_PARAMS)) {
      if (lower.includes(domain)) {
        isFromSearch = true;
        searchEngine = domain.replace('.', '');
        try {
          const url = new URL(ref);
          const value = url.searchParams.get(param);
          searchQuery = value ? decodeURIComponent(value).trim() : '';
        } catch {
          searchQuery = '';
        }
        break;
      }
    }
  }

  return {
    isFromSearch,
    searchQuery,
    searchEngine,
  };
}
