// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia';

export const useCategories = defineStore('categories', {
  state: () => ({
    categories: [
      {
        name: 'iPhone',
        ico: '/icons/iphone.svg',
        link: '/product/iphone',
        img: '/images/iphone.webp',
        uuid: '49097885-2d30-4c88-bc26-eb7db2c6d841',
        isName: true,
      },
      {
        name: 'iPad',
        ico: '/icons/ipad.svg',
        link: '/product/ipad',
        img: '/images/ipad.webp',
        uuid: '50041b06-4eb0-45c8-8c87-bdf0049b4aa7',
        isName: true,
      },
      {
        name: 'Mac',
        ico: '/icons/mac.svg',
        link: '/product/mac',
        img: '/images/mac.webp',
        uuid: '548606d6-5836-4e0f-b93e-4e772ca22076',
        isName: true,
      },
      {
        name: 'Watch',
        ico: '/icons/watch.svg',
        link: '/product/watch',
        img: '/images/watchCard.webp',
        uuid: '4f3c7659-6cb4-4db9-93ec-a8975d681a20',
        isName: true,
      },
      {
        name: 'AirPods',
        ico: '/icons/airpods.svg',
        link: '/product/airpods',
        img: '/images/airpods.webp',
        uuid: 'c22124cd-f6f0-4e4a-b898-c1606f1c8e25',
        isName: true,
      },
      {
        name: 'Аксессуары',
        ico: '/icons/accessories.svg',
        link: '/accessories',
        img: '/images/accessories.webp',
        uuid: '7342f370-a98b-485c-bcb9-41b6a1fd3318',
        isName: true,
        categories: [
          {
            name: 'Аксессуары для iPhone',
            ico: '/icons/iphone.svg',
            link: '/accessories/case',
            img: '/images/case.webp',
            uuid: '3c28df49-c662-469e-90df-888724e24da1',
            isName: true,
          },
          {
            name: 'Адаптеры питания и кабели для зарядки',
            ico: '/icons/ipad.svg',
            link: '/accessories/cable',
            img: '/images/cable.webp',
            uuid: 'baa43a78-850b-42c5-8487-e706e10292c5',
            isName: true,
          },
          {
            name: 'Клавиатуры и мыши',
            ico: '/icons/mac.svg',
            link: '/accessories/mouse',
            img: '/images/mouse.webp',
            uuid: '9c4fc64f-6545-4c8b-9745-e900e506082a',
            isName: true,
          },
        ],
      },
      {
        name: 'Dyson',
        ico: '/icons/dyson.svg',
        style: { height: '70', width: '100' },
        link: '/product/dyson',
        img: '/images/dyson.webp',
        uuid: 'b735980b-2c69-4450-bfac-69dd7ee60e44',
        isName: false,
      },
      {
        name: 'PlayStation 5',
        ico: '/icons/ps.jpg',
        style: { height: '70', width: '120' },
        link: '/product/ps',
        img: '/images/ps.webp',
        uuid: '12411ad6-f511-4812-b7a3-b3e41de95a64',
        isName: false,
      },
      {
        name: 'Другое',
        ico: '/icons/other.svg',
        style: { height: '55', width: '55' },
        link: '/other',
        img: '/images/other.webp',
        uuid: '8aeba603-a913-4577-903d-f7187c5e5abc',
        isName: true,
      },
    ],
  }),
});
