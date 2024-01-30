import { getDataFromStorage, setBadgeNumber } from '@/api/chrome';
import { tableController } from '@/controllers/table';
import { toursController } from '@/controllers/tours';

console.log('This is the background page');
console.log('Put the background scripts here.');

(async () => {
  const data = await getDataFromStorage();
  await setBadgeNumber(data.length);
})();

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case 'tours': {
      toursController(message, sendResponse);
      break;
    }

    case 'table': {
      tableController(message, sendResponse);
      break;
    }

    default: {
      break;
    }
  }

  return true;
});
