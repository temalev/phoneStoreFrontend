// eslint-disable-next-line no-undef
export default defineNuxtPlugin(() => {
  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig();
  return {
    provide: {
      api: {
        getCategories: async () => {
          const res = await fetch(`${config.public.URL}/category`, {
            method: 'GET',
          });
          const data = await res.json();
          return data;
        },
        getAll: async () => {
          const res = await fetch(`${config.public.URL}/product`, {
            method: 'GET',
          });
          const data = await res.json();
          return data;
        },
      },
    },
  };
});
