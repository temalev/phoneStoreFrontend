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
    isCookie: true,
    infoModal: null,
    statistics: [],
    allPromocodes: [],
    params: null,
    currentCategory: null,
  }),

  actions: {
    async fetchWithAuth(url, opts) {
      if (!opts.headers) {
        opts.headers = {
          // 'Content-Type': 'application/json',
        };
      }

      if (this.config.public.NODE_ENV === 'development') {
        const accessToken = localStorage.jwt1;
        opts.headers.Authorization = `Bearer ${accessToken}`;
      }

      const res = await fetch(url, opts);
      if (res.status === 403 || res.status === 401) {
        this.isAuth = false;
        localStorage.removeItem('isAuth');
        return null;
      }
      return res;
    },

    async getPromocode(name) {
      const res = await fetch(
        `${this.config.public.URL}/api/v1/promocode?name=${name}`,
        {
          method: 'GET',
        },
      );
      if (res.ok) { // если HTTP-статус в диапазоне 200-299
        // получаем тело ответа
        const json = await res.json();
        return json;
      }
      const json = await res.json();
      return 0;
    },

    async getAllPromocode(name) {
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/promocode/all`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );
      if (res.ok) { // если HTTP-статус в диапазоне 200-299
        // получаем тело ответа
        this.allPromocodes = await res.json();
      }
    },

    async createPromocode(data) {
      const headers = {
        'Content-Type': 'application/json',
      };
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/promocode`,
        {
          method: 'post',
          credentials: 'include',
          body: JSON.stringify(data),
          headers,
        },
      );
      if (res.ok) { // если HTTP-статус в диапазоне 200-299
        const json = await res.json();
        return json;
      }
    },

    async editPromocode(uuid, data) {
      const headers = {
        'Content-Type': 'application/json',
      };
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/promocode/${uuid}`,
        {
          method: 'put',
          credentials: 'include',
          body: JSON.stringify(data),
          headers,
        },
      ).catch(console.log);
      if (res.ok) { // если HTTP-статус в диапазоне 200-299
        const json = await res.json();
        return json;
      }
    },

    async login(adminData) {
      const headers = {
        'Content-Type': 'application/json',
      };
      const res = await fetch(`${this.config.public.URL}/api/v1/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify(adminData),
      });
      if (res.status === 201 || res.status === 200) {
        this.isAuth = true;
        const data = await res.json();
        localStorage.setItem('jwt1', data.accessToken);
        this.getOrders();
        this.getStatistics();
      }
    },

    async logout() {
      const headers = {
        'Content-Type': 'application/json',
      };
      const res = await fetch(`${this.config.public.URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers,
      });
      localStorage.removeItem('jwt1');
      this.isAuth = false;
    },

    async getOrders() {
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/order`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );
      if (res) {
        const data = await res.json();
        this.newOrders = data;
        this.isAuth = true;
        return data;
      }
      return false;
    },
    async getStatistics() {
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/order/statistics`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );
      if (res) {
        const data = await res.json();
        this.statistics = data;
        return data;
      }
      return false;
    },

    async upgradeOrderStatus(uuid, status) {
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/order/${uuid}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ status }),
        },
      );
      this.getOrders();
    },

    async deleteOrder(uuid) {
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/order/${uuid}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      this.getOrders();
    },

    async updateProduct(uuid, product) {
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/product/${uuid}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(product),
        },
      );
      const data = await res.json();
      this.aprovedOrders = data;
      return data;
    },

    async createdProduct(productData) {
      const headers = {
        'Content-Type': 'application/json',
      };
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/product`,
        {
          method: 'POST',
          credentials: 'include',
          headers,
          body: JSON.stringify(productData),
        },
      );
      const data = await res.json();
      return data;
    },

    async deleteProduct(uuid) {
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/product/${uuid}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      const data = await res.json();
      return data;
    },

    async uploadImg(file) {
      const accessToken = localStorage.jwt1;
      const res = await fetch(`${this.config.public.URL}/api/v1/storage`, {
        method: 'POST',
        credentials: 'include',
        body: file,
        // headers: this.config.public.NODE_ENV === 'development' ? { Authorization: `Bearer ${accessToken}` } : null,
      });
      const data = res.json();
      return data;
    },

    async getCategories() {
      const res = await fetch(`${this.config.public.URL}/api/v1/category`, {
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
      const res = await fetch(`${this.config.public.URL}/api/v1/order`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      this.lastOrder = data;
      return data;
    },

    getAll: async () => {
      const res = await fetch(`${this.config.public.URL}/api/v1/product`, {
        method: 'GET',
      });
      const data = await res.json();

      return data;
    },

    getTotalCost() {
      let cost = 0;
      this.orders.forEach((el) => {
        const quantity = el.quantity || 1;
        if (el.product.variants.length) {
          el.product.variants.forEach(({ optionsIds }, idx) => {
            const isContains = optionsIds.every((optionId) => el.options.includes(optionId));
            if (isContains) {
              // eslint-disable-next-line prefer-destructuring
              cost += el.product.variants[idx].optionsInfo.price * quantity;
            }
          });
        } else {
          cost += el.product.price * quantity;
        }
      });
      this.orders.totalCost = cost;
    },

    getCategory(uuid) {
      this.category = this.categories.filter((el) => el.uuid === uuid);
    },

    async getProducts(uuid) {
      const res = await fetch(
        `${this.config.public.URL}/api/v1/product?categoryUUID=${uuid}`,
        {
          method: 'GET',
        },
      );
      const data = await res.json();
      this.products[this.currentCategory] = data;
      return data;
    },

    async getParams(name) {
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/param/${name}`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );
      const data = await res.json();
      this.params = data;
      return data;
    },

    async setParams(name, data) {
      const headers = {
        'Content-Type': 'application/json',
      };
      const res = await this.fetchWithAuth(
        `${this.config.public.URL}/api/v1/param/${name}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
          credentials: 'include',
          headers,
        },
      );
      const resp = await res.json();
      return resp;
    },
  },
});
