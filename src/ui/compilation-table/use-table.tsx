import { createContext, useContext, useReducer } from 'react';

import type { Tour } from '@/lib/db/schema';
import type { ToursSortConfig } from '@/lib/definitions';

export type TableState = {
  sortConfig: ToursSortConfig | null;
  checked: boolean;
  indeterminate: boolean;
  selectedRows: Array<Tour['id']>;
};

export type TableAction =
  | {
      type: 'set sort config';
      config: TableState['sortConfig'];
    }
  | {
      type: 'selected rows changed';
      checked: TableState['checked'];
      indeterminate: TableState['indeterminate'];
    }
  | {
      type: 'toggle all';
      selectedRows: TableState['selectedRows'];
      checked: TableState['checked'];
      indeterminate: TableState['indeterminate'];
    }
  | {
      type: 'select all';
      selectedRows: TableState['selectedRows'];
    }
  | {
      type: 'update selected rows';
      selectedRows: TableState['selectedRows'];
    };

function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case 'set sort config':
      return {
        ...state,
        sortConfig: action.config,
      };
    case 'selected rows changed':
      return {
        ...state,
        checked: action.checked,
        indeterminate: action.indeterminate,
      };
    case 'toggle all':
      return {
        ...state,
        selectedRows: action.selectedRows,
        checked: action.checked,
        indeterminate: action.indeterminate,
      };
    case 'select all':
      return {
        ...state,
        selectedRows: action.selectedRows,
        checked: true,
        indeterminate: false,
      };
    case 'update selected rows':
      return {
        ...state,
        selectedRows: action.selectedRows,
      };
    default:
      throw Error('Unknown action on tableReducer');
  }
}

export const TableContext = createContext<TableState | null>(null);
export const TableDispatchContext =
  createContext<React.Dispatch<TableAction> | null>(null);

const initialTable: TableState = {
  sortConfig: null,
  checked: false,
  indeterminate: false,
  selectedRows: [],
};

type Props = {
  children: React.ReactNode;
};

export function TableProvider({ children }: Props) {
  const [table, tableDispatch] = useReducer(tableReducer, initialTable);

  return (
    <TableContext.Provider value={table}>
      <TableDispatchContext.Provider value={tableDispatch}>
        {children}
      </TableDispatchContext.Provider>
    </TableContext.Provider>
  );
}

export function useTableState() {
  const object = useContext(TableContext);

  if (!object) {
    throw new Error('useTableState must be used within a TableProvider');
  }
  return object;
}

export function useTableDispatch() {
  const object = useContext(TableDispatchContext);

  if (!object) {
    throw new Error('useTableDispatch must be used within a TableProvider');
  }
  return object;
}

export function useTable() {
  return { table: useTableState(), tableAction: useTableDispatch() };
}
