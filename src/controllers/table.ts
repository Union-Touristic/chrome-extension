import {
  getColumnVisibilityFromStorage,
  getDataFromStorage,
  getRowSelectionFromStorage,
  getSortingFromStorage,
  updateColumnVisibilityStorage,
  updateDataStorage,
  updateRowSelectionStorage,
  updateSortingStorage,
} from '@/api/chrome';
import {
  initialTableData,
  initialTableRowSelection,
  initialTableSorting,
} from '@/lib/consts';
import { TableMessage } from '@/lib/definitions';
import { reorder, sort } from '@/lib/utils';

export async function tableController(
  message: TableMessage,
  sendResponse: (response: any) => void
) {
  switch (message.action) {
    case 'getState': {
      const [data, sorting, rowSelection, columnVisibility] = await Promise.all(
        [
          getDataFromStorage(),
          getSortingFromStorage(),
          getRowSelectionFromStorage(),
          getColumnVisibilityFromStorage(),
        ]
      );
      sendResponse({ data, sorting, rowSelection, columnVisibility });
      break;
    }
    case 'updateDataOrder': {
      const { startIndex, endIndex } = message.payload;
      const fetchedData = await getDataFromStorage();
      const nextData = reorder(fetchedData, startIndex, endIndex);

      const [data, sorting] = await Promise.all([
        updateDataStorage(nextData),
        updateSortingStorage(initialTableSorting),
      ]);

      sendResponse({ data, sorting });
      break;
    }
    case 'setSorting': {
      const [fetchedData, sorting] = await Promise.all([
        getDataFromStorage(),
        updateSortingStorage(message.payload),
      ]);

      const nextData = sort(fetchedData, sorting);

      const data = await updateDataStorage(nextData);
      sendResponse({ sorting, data });
      break;
    }
    case 'setRowSelection': {
      const updatedRowSelection = await updateRowSelectionStorage(
        message.payload
      );
      sendResponse({ rowSelection: updatedRowSelection });
      break;
    }
    case 'setColumnVisibility': {
      const columnVisibility = await updateColumnVisibilityStorage(
        message.payload
      );
      sendResponse({ columnVisibility });
      break;
    }
    case 'reset': {
      const [data, sorting, rowSelection] = await Promise.all([
        updateDataStorage(initialTableData),
        updateSortingStorage(initialTableSorting),
        updateRowSelectionStorage(initialTableRowSelection),
      ]);

      sendResponse({ data, sorting, rowSelection });
      break;
    }
    default: {
      break;
    }
  }
}
