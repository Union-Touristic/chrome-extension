import { Tour } from '@/lib/db/schema';

export type TourWithIdAndPrice = {
  id: Tour['id'];
  price: NonNullable<Tour['price']>;
};

export type ReorderStartEndIndexes = {
  startIndex: number;
  endIndex: number;
};

export type TableMessenger = { type: 'add'; data: Tour[] };
