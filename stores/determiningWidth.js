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
    onResize(width) {
      console.log(width);
      if (window.screen.width <= 700) {
        this.isDesktop = false;
      } else {
        this.isDesktop = true;
      }
    },
  },
});
