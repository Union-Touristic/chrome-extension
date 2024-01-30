import { TableState } from './definitions';

export const initialTableData: TableState['data'] = [];
export const initialTableSorting: TableState['sorting'] = [];
export const initialTableRowSelection: TableState['rowSelection'] = {};
export const initialTableColumnVisibility: TableState['columnVisibility'] = {};

export const initialTableState: TableState = {
  data: initialTableData,
  sorting: initialTableSorting,
  rowSelection: initialTableRowSelection,
  columnVisibility: initialTableColumnVisibility,
};
