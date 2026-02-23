export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    document.querySelector('.main')?.scrollTo({ top: 0 });
  });
});
