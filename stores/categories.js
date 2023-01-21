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
        uuid: '49097885-2d30-4c88-bc26-eb7db2c6d841',
      },
      {
        name: 'IPad',
        ico: '/icons/ipad.svg',
        link: 'ipad',
        img: '/images/ipad.jpeg',
        uuid: '50041b06-4eb0-45c8-8c87-bdf0049b4aa7',
      },
      {
        name: 'Mac',
        ico: '/icons/mac.svg',
        link: 'mac',
        img: '/images/mac.jpeg',
        uuid: '548606d6-5836-4e0f-b93e-4e772ca22076',
      },
      {
        name: 'Watch',
        ico: '/icons/watch.svg',
        link: 'watch',
        img: '/images/watchCard.jpeg',
        uuid: '4f3c7659-6cb4-4db9-93ec-a8975d681a20',
      },
      {
        name: 'AirPods',
        ico: '/icons/airpods.svg',
        link: 'airpods',
        img: '/images/airpods.jpeg',
        uuid: 'c22124cd-f6f0-4e4a-b898-c1606f1c8e25',
      },
      {
        name: 'Аксессуары',
        ico: '/icons/accessories.svg',
        link: 'accessories',
        img: '/images/accessories.jpg',
        uuid: '7342f370-a98b-485c-bcb9-41b6a1fd3318',
      },
      {
        ico: '/icons/dyson.svg',
        style: { height: '70', width: '100' },
        link: 'dyson',
        img: '/images/dyson.jpeg',
        uuid: 'b735980b-2c69-4450-bfac-69dd7ee60e44',
      },
      {
        ico: '/icons/ps.jpg',
        style: { height: '70', width: '120' },
        link: 'ps',
        img: '/images/ps.jpeg',
        uuid: '12411ad6-f511-4812-b7a3-b3e41de95a64',
      },
    ],
  }),
});
