import React, { createContext, useContext, useReducer } from 'react';

import tableReducer, { TableAction, type TableState } from './reducer';

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

export const TableProvider = ({ children }: Props) => {
  const [table, tableDispatch] = useReducer(tableReducer, initialTable);

  return (
    <TableContext.Provider value={table}>
      <TableDispatchContext.Provider value={tableDispatch}>
        {children}
      </TableDispatchContext.Provider>
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const object = useContext(TableContext);

  if (!object) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return object;
};
export const useTableDispatch = () => {
  const object = useContext(TableDispatchContext);

  if (!object) {
    throw new Error('useTableDispatch must be used within a TableProvider');
  }
  return object;
};
