// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia';

export const useApi = defineStore('api', {
  state: () => ({
    categories: true,
    // eslint-disable-next-line no-undef
    config: useRuntimeConfig(),
  }),

  actions: {
    async getCategories() {
      console.log('run');
      const res = await fetch(`${this.config.public.URL}/category`, {
        method: 'GET',
      });
      const data = await res.json();
      return data;
    },
    getAll: async () => {
      const res = await fetch(`${this.config.public.URL}/product`, {
        method: 'GET',
      });
      const data = await res.json();
      return data;
    },
  },
});
