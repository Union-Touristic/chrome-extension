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

export type SortingState = ReactTableSortingState;
export type RowSelectionState = ReactTableRowSelectionState;
export type ColumnVisibilityState = ReactTableVisilityState;

export interface TableState {
  data: Tour[];
  sorting: SortingState;
  rowSelection: RowSelectionState;
  columnVisibility: ColumnVisibilityState;
}

export type CreateTourMessage = {
  type: 'tours';
  action: 'create';
  payload: Tour[];
};

export type RetrieveToursMessage = {
  type: 'tours';
  action: 'retrieve';
  payload?: undefined;
};

export type UpdateTourMessage = {
  type: 'tours';
  action: 'update';
  payload: TourWithIdAndPrice;
};

export type DeleteTourMessage = {
  type: 'tours';
  action: 'delete';
  payload: Tour['id'] | Tour['id'][];
};

export type ToursMessage =
  | CreateTourMessage
  | RetrieveToursMessage
  | UpdateTourMessage
  | DeleteTourMessage;

export type GetTableMessage = {
  type: 'table';
  action: 'getState';
  payload?: undefined;
};

export type UpdateDataOrderMessage = {
  type: 'table';
  action: 'updateDataOrder';
  payload: ReorderStartEndIndexes;
};

export type SetSortingMessage = {
  type: 'table';
  action: 'setSorting';
  payload: SortingState;
};

export type SetRowSelectionMessage = {
  type: 'table';
  action: 'setRowSelection';
  payload: TableState['rowSelection'];
};

export type SetColumnVisibilityMessage = {
  type: 'table';
  action: 'setColumnVisibility';
  payload: ColumnVisibilityState;
};

export type ResetTableMessage = {
  type: 'table';
  action: 'reset';
  payload?: undefined;
};

export type TableMessage =
  | GetTableMessage
  | UpdateDataOrderMessage
  | SetSortingMessage
  | SetRowSelectionMessage
  | SetColumnVisibilityMessage
  | ResetTableMessage;
