import { Tour } from '@/lib/db/schema';
import {
  ColumnVisibilityState,
  ReorderStartEndIndexes,
  RowSelectionState,
  SortingState,
  TableState,
  TourWithIdAndPrice,
} from '@/lib/definitions';
import { reorder, sort } from '@/lib/utils';

export const tableInitialState: TableState = {
  data: [],
  sorting: [],
  rowSelection: {},
  columnVisibility: {},
};

export async function getTableStateFromStorage(): Promise<TableState> {
  const storage = await chrome.storage.local.get();
  const tableState: TableState | undefined = storage['tableState'];

  if (tableState === undefined) {
    await setTableStateInStorage(tableInitialState); // TODO: maybe delete it
    return tableInitialState;
  }

  return tableState;
}

export async function setTableStateInStorage(nextState: TableState) {
  await chrome.storage.local.set({ tableState: nextState });
}

export async function addDataToTable(incomingData: Tour) {
  const tableState = await getTableStateFromStorage();
  const { data } = tableState;

  const nextState: TableState = {
    ...tableState,
    data: [...data, incomingData],
    sorting: tableInitialState['sorting'],
  };

  await setTableStateInStorage(nextState);
}

export async function updateDataOrderInTable({
  startIndex,
  endIndex,
}: ReorderStartEndIndexes) {
  const tableState = await getTableStateFromStorage();
  const nextData = reorder(tableState.data, startIndex, endIndex);
  const nextState: TableState = {
    ...tableState,
    data: nextData,
    sorting: tableInitialState['sorting'],
  };
  await setTableStateInStorage(nextState);
  return nextState;
}

export async function updateSortingInTable(incomingSortingState: SortingState) {
  const tableState = await getTableStateFromStorage();
  const nextData = sort(tableState.data, incomingSortingState);
  const nextState: TableState = {
    ...tableState,
    data: nextData,
    sorting: incomingSortingState,
  };
  await setTableStateInStorage(nextState);
  return nextState;
}

export async function updateRowSelectionInTable(
  incomingRowSelection: RowSelectionState
) {
  const tableState = await getTableStateFromStorage();
  const nextState: TableState = {
    ...tableState,
    rowSelection: incomingRowSelection,
  };
  await setTableStateInStorage(nextState);
  return nextState;
}

export async function updateColumnVisibility(
  incomingColumnVisibility: ColumnVisibilityState
) {
  const tableState = await getTableStateFromStorage();
  const nextState: TableState = {
    ...tableState,
    columnVisibility: incomingColumnVisibility,
  };
  await setTableStateInStorage(nextState);
  return nextState;
}

export async function removeItemDataInTable(incomingData: string | string[]) {
  const tableState = await getTableStateFromStorage();
  const nextData = tableState.data.filter(
    (item) => !incomingData.includes(item.id)
  );
  const nextRowSelection = Object.fromEntries(
    Object.entries(tableState.rowSelection).filter(
      (row) => !incomingData.includes(row[0])
    )
  );
  const nextState: TableState = {
    ...tableState,
    data: nextData,
    rowSelection: nextRowSelection,
  };

  await setTableStateInStorage(nextState);
  return nextState;
}

export async function updateItemInTable(incomingData: TourWithIdAndPrice) {
  const tableState = await getTableStateFromStorage();
  const nextData = tableState.data.map((item) => {
    if (item.id === incomingData.id)
      return { ...item, price: incomingData['price'] };
    return item;
  });
  const nextState: TableState = {
    ...tableState,
    data: nextData,
    sorting: tableInitialState['sorting'],
  };

  await setTableStateInStorage(nextState);
  return nextState;
}

export async function clearTable() {
  const tableState = await getTableStateFromStorage();
  const nextState: TableState = {
    ...tableInitialState,
    columnVisibility: tableState['columnVisibility'],
  };
  await setTableStateInStorage(nextState);
  return nextState;
}
// This api for messaging
export const getDataFromStorage = async (): Promise<Tour[]> => {
  const storage = await chrome.storage.local.get('tours');
  const data: Tour[] | undefined = storage['tours'];
  if (data === undefined) return Array(0);
  return data;
};

export const addToursToStorage = async (data: Tour[]): Promise<Tour[]> => {
  const fetchedData = await getDataFromStorage();
  const updatedTours = [...fetchedData, ...data];
  await chrome.storage.local.set({ tours: updatedTours });
  return updatedTours;
};

export const updateDataItemInStorage = async (
  incomingData: TourWithIdAndPrice
) => {
  const fetchedData = await getDataFromStorage();

  const updatedTours = fetchedData.map((item) => {
    if (item.id === incomingData.id)
      return { ...item, price: incomingData['price'] };
    return item;
  });

  await chrome.storage.local.set({ tours: updatedTours });
  return updatedTours;
};

export const deleteDataItemInStorage = async (
  incomingData: Tour['id'] | Tour['id'][]
) => {
  const fetchedData = await getDataFromStorage();

  const updatedTours = fetchedData.filter(
    (item) => !incomingData.includes(item.id)
  );

  await chrome.storage.local.set({ tours: updatedTours });
  return updatedTours;
};

export const updateDataStorage = async (data: Tour[]): Promise<Tour[]> => {
  await chrome.storage.local.set({ tours: data });
  return data;
};

export const getRowSelectionFromStorage =
  async (): Promise<RowSelectionState> => {
    const storage = await chrome.storage.local.get('rowSelection');
    const rowSelection: RowSelectionState | undefined = storage['rowSelection'];
    if (rowSelection === undefined) return {};
    return rowSelection;
  };

export const updateRowSelectionStorage = async (
  rowSelection: RowSelectionState
): Promise<RowSelectionState> => {
  await chrome.storage.local.set({ rowSelection });
  return rowSelection;
};

export const getSortingFromStorage = async (): Promise<SortingState> => {
  const storage = await chrome.storage.local.get('sorting');
  const sorting: SortingState | undefined = storage['sorting'];
  if (sorting === undefined) return Array(0);
  return sorting;
};

export const updateSortingStorage = async (
  sorting: SortingState
): Promise<SortingState> => {
  await chrome.storage.local.set({ sorting });
  return sorting;
};

export async function getColumnVisibilityFromStorage(): Promise<ColumnVisibilityState> {
  const storage = await chrome.storage.local.get('columnVisibility');
  const columnVisibility: ColumnVisibilityState | undefined =
    storage['columnVisibility'];
  if (columnVisibility === undefined) return {};
  return columnVisibility;
}

export async function updateColumnVisibilityStorage(
  columnVisibility: ColumnVisibilityState
): Promise<ColumnVisibilityState> {
  await chrome.storage.local.set({ columnVisibility });
  return columnVisibility;
}
