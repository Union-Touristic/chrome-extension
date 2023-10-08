import React from 'react';

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
  nights: number;
  occupancy: Occupancy;
  operator: string;
  price: number;
  region: string;
  roomType: string;
  thumbnail: string;
};

export type Occupancy = {
  adultsCount: number;
  childrenCount: number;
  childAges: number[];
};

export type HeroIcon = (props: React.ComponentProps<'svg'>) => JSX.Element;

export type SortConfig = {
  key: string;
  direction: 'asc' | 'dsc';
};
