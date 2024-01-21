import type { Tour } from '@/lib/db/schema';
import type { TableMessenger } from '@/lib/definitions';
import { reorder } from '@/lib/utils';
import { RowSelectionState, SortingState } from '@tanstack/react-table';

console.log('This is the background page');
console.log('Put the background scripts here.');

const getDataFromStorage = async (): Promise<Tour[]> => {
  const storage = await chrome.storage.local.get('tours');
  const tours: Tour[] | undefined = storage['tours'];
  if (tours === undefined) return Array(0);
  return tours;
};

const addToursToStorage = async (data: Tour[]): Promise<Tour[]> => {
  const tours = await getDataFromStorage();

  if (tours) {
    const updatedTours = [...tours, ...data];
    await chrome.storage.local.set({ tours: updatedTours });

    return updatedTours;
  }

  await chrome.storage.local.set({ tours: data });

  return data;
};

const getRowSelectionFromStorage = async (): Promise<RowSelectionState> => {
  const storage = await chrome.storage.local.get('rowSelection');
  const rowSelection: RowSelectionState | undefined = storage['rowSelection'];
  if (rowSelection === undefined) return {};
  return rowSelection;
};

const updateRowSelectionStorage = async (
  rowSelection: RowSelectionState
): Promise<RowSelectionState> => {
  await chrome.storage.local.set({ rowSelection });
  return rowSelection;
};

const getSortingFromStorage = async (): Promise<SortingState> => {
  const storage = await chrome.storage.local.get('sorting');
  const sorting: SortingState | undefined = storage['sorting'];
  if (sorting === undefined) return Array(0);
  return sorting;
};

const updateSortingStorage = async (
  data: SortingState
): Promise<SortingState> => {
  await chrome.storage.local.set({ sorting: data });
  return data;
};

const updateToursStorage = async (data: Tour[]): Promise<Tour[]> => {
  await chrome.storage.local.set({ tours: data });
  return data;
};

chrome.runtime.onMessage.addListener(
  (
    message: TableMessenger,
    _,
    // TODO: refactor response type
    sendResponse: (response: Tour[] | Record<string, any>) => void
  ): boolean => {
    switch (message.type) {
      case 'retrieve':
        getDataFromStorage().then((tours) => {
          tours ? sendResponse(tours) : sendResponse(Array(0));
        });
        return true;

      case 'init': {
        Promise.all([
          getDataFromStorage(),
          getSortingFromStorage(),
          getRowSelectionFromStorage(),
        ]).then((value) => {
          const [data, sorting, rowSelection] = value;
          sendResponse({ data, sorting, rowSelection });
        });
        return true;
      }

      case 'add': {
        Promise.all([
          addToursToStorage(message.data),
          updateSortingStorage(Array(0)),
        ]).then((value) => {
          const [data, _] = value;
          sendResponse(data);
        });
        return true;
      }

      case 'update':
        updateToursStorage(message.data).then((updatedTours) => {
          sendResponse(updatedTours);
        });
        return true;

      case 'update tour price': {
        getDataFromStorage().then((tours) => {
          const nextTours = tours.map((tour) => {
            if (tour.id === message.data.id) {
              return { ...tour, price: message.data.price };
            } else {
              return tour;
            }
          });

          Promise.all([
            updateToursStorage(nextTours),
            updateSortingStorage(Array(0)),
          ]).then((value) => {
            const [data, sorting] = value;
            sendResponse({ data, sorting });
          });
        });
        return true;
      }

      case 'update tours order': {
        getDataFromStorage().then((tours) => {
          if (tours) {
            const { startIndex, endIndex } = message.data;
            const nextTours = reorder(tours, startIndex, endIndex);
            Promise.all([
              updateToursStorage(nextTours),
              updateSortingStorage(Array(0)),
            ]).then((value) => {
              const [data, sorting] = value;
              sendResponse({ data, sorting });
            });
          } else {
            throw Error('Something went wrong');
          }
        });
        return true;
      }

      case 'sort tours': {
        getDataFromStorage().then((tours) => {
          if (tours) {
            const [{ id, desc }] = message.sorting;
            const nextTours = tours.toSorted((tourA, tourB) => {
              const fieldA = tourA[id as keyof typeof tourA];
              const fieldB = tourB[id as keyof typeof tourB];
              const asc = !desc;

              if (asc) {
                if (!fieldA) return 1;
                if (!fieldB) return 1;

                if (fieldA < fieldB) return -1;
                if (fieldA > fieldB) return 1;
                return 0;
              }

              if (!fieldA) return 1;
              if (!fieldB) return 1;

              if (fieldA < fieldB) return 1;
              if (fieldA > fieldB) return -1;
              return 0;
            });

            Promise.all([
              updateToursStorage(nextTours),
              updateSortingStorage(message.sorting),
            ]).then((value) => {
              const [updatedTours, updatedSorting] = value;
              sendResponse(updatedTours);
            });
          } else {
            throw Error('Something went wrong');
          }
        });
        return true;
      }

      case 'setRowSelection': {
        updateRowSelectionStorage(message.rowSelection).then((rowSelection) => {
          sendResponse({ rowSelection });
        });
        return true;
      }

      case 'remove': {
        Promise.all([getDataFromStorage(), getRowSelectionFromStorage()]).then(
          (value) => {
            const [data, rowSelection] = value;

            const filteredData = data.filter(
              (item) => !message.data.includes(item.id)
            );

            const rowSelectionArray = Object.entries(rowSelection);
            const filteredRowSelectionArray = rowSelectionArray.filter(
              (row) => !message.data.includes(row[0])
            );
            const filteredRowSelection = Object.fromEntries(
              filteredRowSelectionArray
            );

            Promise.all([
              updateToursStorage(filteredData),
              updateRowSelectionStorage(filteredRowSelection),
            ]).then((value) => {
              const [data, rowSelection] = value;
              sendResponse({ data, rowSelection });
            });
          }
        );
        return true;
      }
      default:
        throw Error('Unknown message type');
    }
  }
);

// chrome.runtime.onMessage.addListener(
//   (
//     message: RowSelectionMessenger,
//     _,
//     sendResponse: (response: RowSelectionState) => void
//   ): boolean => {
//     switch (message.type) {
//       case 'rowSelection/init': {
//         getRowSelectionFromStorage().then((rowSelection) => {
//           if (rowSelection) {
//             sendResponse(rowSelection);
//           } else {
//             updateRowSelectionStorage({}).then((value) => sendResponse(value));
//           }
//         });
//         return true;
//       }
//       case 'set row selection': {
//         updateRowSelectionStorage(message.data).then((rowSelection) => {
//           sendResponse(rowSelection);
//         });
//         return true;
//       }
//       // TODO: make one listener
//       // default:
//       //   throw Error('Unknown message type');
//     }
//   }
// );
