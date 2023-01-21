// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia';

export const useDetermininingWidth = defineStore('determininingWidth', {
  state: () => ({
    isDesktop: true,
  }),

  actions: {
    editDesktop(val) {
      this.isDesktop = val;
    },
  },
});
