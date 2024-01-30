import {
  addToursToStorage,
  deleteDataItemInStorage,
  getDataFromStorage,
  getRowSelectionFromStorage,
  setBadgeNumber,
  updateDataItemInStorage,
  updateRowSelectionStorage,
  updateSortingStorage,
} from '@/api/chrome';
import { initialTableSorting } from '@/lib/consts';
import { ToursMessage } from '@/lib/definitions';

export async function toursController(
  message: ToursMessage,
  sendResponse: (response: any) => void
) {
  switch (message.action) {
    case 'create': {
      const [sorting, data] = await Promise.all([
        updateSortingStorage(initialTableSorting),
        addToursToStorage(message.payload),
      ]);

      await setBadgeNumber(data.length);

      sendResponse({ sorting, data });
      break;
    }

    case 'retrieve': {
      const data = await getDataFromStorage();
      sendResponse({ data });
      break;
    }

    case 'update': {
      const [sorting, data] = await Promise.all([
        updateSortingStorage(initialTableSorting),
        updateDataItemInStorage(message.payload),
      ]);
      sendResponse({ sorting, data });
      break;
    }

    case 'delete': {
      const [data, fetchedRowSelection] = await Promise.all([
        deleteDataItemInStorage(message.payload),
        getRowSelectionFromStorage(),
      ]);

      const filteredRowSelection = Object.fromEntries(
        Object.entries(fetchedRowSelection).filter(
          (row) => !message.payload.includes(row[0])
        )
      );

      const [rowSelection] = await Promise.all([
        updateRowSelectionStorage(filteredRowSelection),
        setBadgeNumber(data.length),
      ]);

      sendResponse({
        data,
        rowSelection,
      });

      break;
    }

    default: {
      break;
    }
  }
}
