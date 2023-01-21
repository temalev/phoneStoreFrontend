// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia';

export const useCategories = defineStore('categories', {
  state: () => ({
    categories: [
      {
        name: 'IPhone',
        ico: '/icons/iphone.svg',
        link: 'iphone',
        img: '/images/iphone.jpeg',
      },
      {
        name: 'IPad',
        ico: '/icons/ipad.svg',
        link: 'ipad',
        img: '/images/ipad.jpeg',
      },
      {
        name: 'Mac',
        ico: '/icons/mac.svg',
        link: 'mac',
        img: '/images/mac.jpeg',
      },
      {
        name: 'Watch',
        ico: '/icons/watch.svg',
        link: 'watch',
        img: '/images/watchCard.jpeg',
      },
      {
        name: 'AirPods',
        ico: '/icons/airpods.svg',
        link: 'airpods',
        img: '/images/airpods.jpeg',
      },
      {
        name: 'Аксессуары',
        ico: '/icons/accessories.svg',
        link: 'accessories',
        img: '/images/accessories.jpg',
      },
      {
        ico: '/icons/dyson.svg',
        style: { height: '70', width: '100' },
        link: 'dyson',
        img: '/images/dyson.jpeg',
      },
      {
        ico: '/icons/ps.jpg',
        style: { height: '70', width: '120' },
        link: 'ps',
        img: '/images/ps.jpeg',
      },
    ],
  }),
});
