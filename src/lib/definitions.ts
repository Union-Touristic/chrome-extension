import { Tour } from '@/lib/db/schema';
import {
  SortingState as ReactTableSortingState,
  RowSelectionState as ReactTableRowSelectionState,
  VisibilityState as ReactTableVisilityState,
} from '@tanstack/react-table';

export type TourWithIdAndPrice = {
  id: Tour['id'];
  price: NonNullable<Tour['price']>;
};

export type ReorderStartEndIndexes = {
  startIndex: number;
  endIndex: number;
};

export type TableMessenger = { type: 'add'; data: Tour[] };

export type SortingState = ReactTableSortingState;
export type RowSelectionState = ReactTableRowSelectionState;
export type ColumnVisibilityState = ReactTableVisilityState;

export interface TableState {
  data: Tour[];
  sorting: SortingState;
  rowSelection: RowSelectionState;
  columnVisibility: ColumnVisibilityState;
}
