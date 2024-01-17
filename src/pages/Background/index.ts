import type { Tour } from '@/lib/db/schema';
import type { ToursMessenger } from '@/lib/definitions';
import { reorder } from '@/lib/utils';

console.log('This is the background page');
console.log('Put the background scripts here.');

const getToursFromStorage = async () => {
  const storage = await chrome.storage.local.get('tours');
  const tours: Tour[] | undefined = storage['tours'];
  return tours;
};

const addToursToStorage = async (data: Tour[]): Promise<Tour[]> => {
  const tours = await getToursFromStorage();

  if (tours) {
    const updatedTours = [...tours, ...data];
    await chrome.storage.local.set({ tours: updatedTours });

    return updatedTours;
  }

  await chrome.storage.local.set({ tours: data });

  return data;
};

const updateToursStorage = async (data: Tour[]): Promise<Tour[]> => {
  await chrome.storage.local.set({ tours: data });
  return data;
};

chrome.runtime.onMessage.addListener(
  (
    message: ToursMessenger,
    _,
    sendResponse: (response: Tour[]) => void
  ): boolean => {
    switch (message.type) {
      case 'retrieve':
        getToursFromStorage().then((tours) => {
          tours ? sendResponse(tours) : sendResponse(Array(0));
        });
        return true;

      case 'init':
        getToursFromStorage().then((tours) => {
          tours ? sendResponse(tours) : sendResponse(Array(0));
        });
        return true;

      case 'add':
        addToursToStorage(message.data).then((tours) => {
          sendResponse(tours);
        });
        return true;

      case 'update':
        updateToursStorage(message.data).then((updatedTours) => {
          sendResponse(updatedTours);
        });
        return true;

      case 'update tour price':
        getToursFromStorage().then((tours) => {
          if (tours) {
            const nextTours = tours.map((tour) => {
              if (tour.id === message.data.id) {
                return { ...tour, price: message.data.price };
              } else {
                return tour;
              }
            });

            updateToursStorage(nextTours).then((updatedTours) => {
              sendResponse(updatedTours);
            });
          } else {
            throw Error('Something went wrong');
          }
        });
        return true;

      case 'update tours order': {
        getToursFromStorage().then((tours) => {
          if (tours) {
            const { startIndex, endIndex } = message.data;
            const nextTours = reorder(tours, startIndex, endIndex);
            updateToursStorage(nextTours).then((updatedTours) => {
              sendResponse(updatedTours);
            });
          } else {
            throw Error('Something went wrong');
          }
        });
        return true;
      }

      case 'remove':
        getToursFromStorage().then((tours) => {
          if (tours) {
            const filteredTours = tours.filter(
              (tour) => !message.data.includes(tour.id)
            );
            updateToursStorage(filteredTours).then((updatedTours) => {
              sendResponse(updatedTours);
            });
          } else {
            throw Error('Something went wrong.');
          }
        });
        return true;
      default:
        throw Error('Unknown message type');
    }
  }
);
