import { Tour } from '@/lib/db/schema';

export type CompilationStatus = 'Active' | 'Archived';

export type ToursSortConfig = {
  sortKey: Extract<keyof Tour, 'departureDate' | 'price'>;
  direction: 'asc' | 'dsc';
};

export type Occupancy = {
  adultsCount: number;
  childrenCount: number;
  childAges: number[];
};

export type Breadcrumb = {
  label: string | React.ReactNode;
  href: string;
  active?: boolean;
};

// Definitions for chrome runtime
export type ToursMessenger =
  | { type: 'retrieve' }
  | { type: 'init' }
  | { type: 'add'; data: Tour[] }
  | { type: 'update'; data: Tour[] }
  | { type: 'remove'; data: Tour['id'] | Tour['id'][] };
