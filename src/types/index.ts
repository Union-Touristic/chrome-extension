export type Tour = {
  boardType: string;
  checkinDt: string;
  city_from: string;
  country: string;
  currency: string;
  description: string;
  hotelName: string;
  href: string;
  id: string;
  initial_price: number;
  nights: number;
  occupancy: Occupancy;
  operator: string;
  price: number;
  region: string;
  roomType: string;
  thumbnail: string;
};

export type Occupancy = {
  adultsCount: string;
  childAges: [number, number][];
  childrenCount: number;
};

export type HeroIcon = any;

export type SortConfig = {
  key: string;
  direction: 'asc' | 'dsc';
};
