import {ICONS, IMAGES} from '../constants';

export const restaurants = [
  {
    id: 1,
    name: 'Parrilladas Argentinas',
    photo: IMAGES.burger,
    location: {
      latitude: -33.4564448,
      longitude: -70.6980798,
    },
    menu: [
      {
        id: 1,
        photo: IMAGES.burger,
        price: 3,
        calories: 300,
        name: 'Morbi congue',
        description:
          'Morbi congue elementum sem, a volutpat felis rutrum eget. Praesent.',
      },
      {
        id: 2,
        photo: IMAGES.pizza,
        price: 3,
        calories: 200,
        name: 'Fusce suscipit',
        description:
          'Fusce suscipit placerat enim, eu luctus ex gravida id. Donec.',
      },
    ],
    categories: [1, 5, 8],
    duration: '20-30 min',
    rating: 4.8,
    priceRate: 3,
    courier: {
      avatar: ICONS.avatarMale,
      name: 'Pepe',
    },
  },
  {
    id: 2,
    name: 'Las Vacas Gordas',
    photo: IMAGES.pizza,
    location: {
      latitude: -33.4410845,
      longitude: -70.6644033,
    },
    menu: [
      {
        id: 1,
        photo: IMAGES.burger,
        price: 3,
        calories: 99,
        name: 'Morbi congue',
        description:
          'Morbi congue elementum sem, a volutpat felis rutrum eget. Praesent.',
      },
    ],
    categories: [1, 2, 3],
    duration: '25-35 min',
    rating: 4.5,
    priceRate: 2,
    courier: {
      avatar: ICONS.avatarFemale,
      name: 'Pepa',
    },
  },
  {
    id: 3,
    name: 'Sushi Store',
    photo: IMAGES.sushi,
    location: {
      latitude: -33.4564448,
      longitude: -70.6980798,
    },
    menu: [
      {
        id: 1,
        photo: IMAGES.burger,
        price: 3,
        calories: 99,
        name: 'Morbi congue',
        description:
          'Morbi congue elementum sem, a volutpat felis rutrum eget. Praesent.',
      },
    ],
    categories: [4, 5, 8],
    duration: '20-30 min',
    rating: 4.5,
    priceRate: 1,
    courier: {
      avatar: ICONS.avatarMale,
      name: 'Pepe',
    },
  },
];

export default restaurants;
