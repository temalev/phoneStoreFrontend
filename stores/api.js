// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia';

export const useApi = defineStore('api', {
  state: () => ({
    categories: null,
    category: null,
    // eslint-disable-next-line no-undef
    config: useRuntimeConfig(),
    products: [],
    orders: [],
  }),

  actions: {
    async getCategories() {
      const res = await fetch(`${this.config.public.URL}/category`, {
        method: 'GET',
      });
      const data = await res.json();
      this.categories = data;
      return data;
    },

    getAll: async () => {
      const res = await fetch(`${this.config.public.URL}/product`, {
        method: 'GET',
      });
      const data = await res.json();
      return data;
    },

    getCategory(uuid) {
      this.category = this.categories.filter((el) => el.uuid === uuid);
    },

    async getProducts(uuid) {
      if (this.config.public.URL) {
        const res = await fetch(`${this.config.public.URL}/product?categoryUUID=${uuid}`, {
          method: 'GET',
        });
        const data = await res.json();
        this.products = data;
        return data;
      }
      return {
        success: false,
      };
    },
  },
});
