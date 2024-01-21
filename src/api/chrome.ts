import { Tour } from '@/lib/db/schema';
import { RowSelectionState, SortingState } from '@tanstack/react-table';

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
