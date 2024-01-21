import { Tour } from '@/lib/db/schema';
import { RowSelectionState, SortingState } from '@tanstack/react-table';

export type CompilationStatus = 'Active' | 'Archived';

export type TourPrice = {
  id: Tour['id'];
  price: NonNullable<Tour['price']>;
};

export type ReorderStartEndIndexes = {
  startIndex: number;
  endIndex: number;
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
  | { type: 'remove'; data: Tour['id'] | Tour['id'][] }
  | { type: 'update tour price'; data: TourPrice }
  | { type: 'update tours order'; data: ReorderStartEndIndexes }
  | { type: 'sort tours'; sorting: SortingState };

export type RowSelectionMessenger =
  | {
      type: 'rowSelection/init';
    }
  | {
      type: 'set row selection';
      data: RowSelectionState;
    };
