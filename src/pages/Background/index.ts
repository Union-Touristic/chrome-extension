import { addToursToStorage, updateSortingStorage } from '@/api/chrome';
import type { Tour } from '@/lib/db/schema';
import type { TableMessenger } from '@/lib/definitions';

console.log('This is the background page');
console.log('Put the background scripts here.');

chrome.runtime.onMessage.addListener(
  (
    message: TableMessenger,
    _,
    // TODO: refactor response type
    sendResponse: (response: Tour[] | Record<string, any>) => void
  ): boolean => {
    switch (message.type) {
      case 'add': {
        Promise.all([
          addToursToStorage(message.data),
          updateSortingStorage(Array(0)),
        ]).then((value) => {
          const [data] = value;
          sendResponse(data);
        });
        return true;
      }
      default:
        throw Error('Unknown message type');
    }
  }
);
