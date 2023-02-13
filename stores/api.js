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
    lastOrder: null,
    isAuth: false,
    newOrders: [],
    aprovedOrders: [],
  }),

  actions: {
    async fetchWithAuth(url, opts) {
      if (this.config.public.NODE_ENV === 'development') {
        const accessToken = localStorage.jwt1;
        opts.headers = {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        };
      }
      const res = await fetch(url, opts);
      if (res.status === 403 || res.status === 401) {
        this.isAuth = false;
        return null;
      } return res;
    },

    async login(adminData) {
      const headers = {
        'Content-Type': 'application/json',
      };
      const res = await fetch(`${this.config.public.URL}/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify(adminData),
      });
      if (res.status === 201 || res.status === 200) {
        this.isAuth = true;
        const data = await res.json();
        localStorage.setItem('jwt1', data.accessToken);
      }
    },

    async logout() {
      const headers = {
        'Content-Type': 'application/json',
      };
      const res = await fetch(`${this.config.public.URL}/auth/logout`, {
        method: 'POST',
        headers,
      });
      localStorage.removeItem('jwt1');
      this.isAuth = false;
    },

    async getOrders() {
      const res = await this.fetchWithAuth(`${this.config.public.URL}/order`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      this.newOrders = data;
      return data;
    },

    async upgradeOrderStatus(uuid, status) {
      const res = await this.fetchWithAuth(`${this.config.public.URL}/order/${uuid}`, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      this.aprovedOrders = data;
      return data;
    },

    async deleteOrder(uuid) {
      const res = await this.fetchWithAuth(`${this.config.public.URL}/order/${uuid}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      this.aprovedOrders = data;
      return data;
    },

    async updateProduct(uuid, product) {
      const res = await this.fetchWithAuth(`${this.config.public.URL}/product/${uuid}`, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(product),
      });
      const data = await res.json();
      this.aprovedOrders = data;
      return data;
    },

    async getCategories() {
      const res = await fetch(`${this.config.public.URL}/category`, {
        method: 'GET',
      });
      const data = await res.json();
      this.categories = data;
      return data;
    },

    async createOrder(orderData) {
      const headers = {
        'Content-Type': 'application/json',
      };
      const res = await fetch(`${this.config.public.URL}/order`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      this.lastOrder = data;
      return data;
    },

    getAll: async () => {
      const res = await fetch(`${this.config.public.URL}/product`, {
        method: 'GET',
      });
      const data = await res.json();
      return data;
    },

    getTotalCost() {
      let cost = null;
      this.orders.map((el) => {
        el.product.variants.forEach(({ optionsIds }, idx) => {
          const isContains = optionsIds.every((optionId) => el.options.includes(optionId));
          if (isContains) {
            // eslint-disable-next-line prefer-destructuring
            cost += el.product.variants[idx].optionsInfo.price;
          }
        });
        return cost;
      });
      this.orders.totalCost = cost;
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
