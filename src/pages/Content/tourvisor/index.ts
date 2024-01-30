import { Tour } from '@/lib/db/schema';
import {
  collectTourOptions,
  createAddButton,
  createTTdElement,
} from './helpers';
import { addDataToTable, getTableStateFromStorage } from '@/api/chrome';
import { CreateTourMessage, RetrieveToursMessage } from '@/lib/definitions';

console.log('TOURVISOR content script works!');
console.log('Must reload extension for modifications to take effect.');

const TVSearchFormElement = document.querySelector('.tv-search-form');

if (TVSearchFormElement) {
  // Search form was appeared

  const TVSearchFormElementObserver = new MutationObserver((mutationList) => {
    onElementChildListMutation(mutationList, handleTVSearchFormElementMutation);
  });

  TVSearchFormElementObserver.observe(TVSearchFormElement, {
    childList: true,
  });
} else {
  console.log("I'm not existing, I'm ", TVSearchFormElement);
}

function handleTVSearchFormElementMutation(mutation: MutationRecord) {
  // console.log('handleTVSearchFormElementMutation: ', mutation);

  mutation.addedNodes.forEach((node) => {
    const element = node as Element;
    if (!element.classList.contains('TVSearchResults')) {
      return;
    }

    // TVSearchResults exists ...

    const TVResultListViewListElement = element.querySelector(
      '.TVResultListViewList'
    );

    if (!TVResultListViewListElement) {
      return;
    }

    // TVResultListViewListElement exists ...

    const TVResultListViewListElementObserver = new MutationObserver(
      (mutationList) => {
        onElementChildListMutation(
          mutationList,
          handleTVResultListViewListElementMutation
        );
      }
    );

    TVResultListViewListElementObserver.observe(TVResultListViewListElement, {
      childList: true,
    });
  });
}

function handleTVResultListViewListElementMutation(mutation: MutationRecord) {
  // console.log('handleTVHotelResultBodyContainerElementMutation: ', mutation);

  mutation.addedNodes.forEach((node) => {
    const element = node as Element;
    if (!element.classList.contains('TVResultListViewItem')) return;
    // TVResultListViewItem exists ...

    const TVHotelResulItemInfoElement = element.querySelector(
      '.TVHotelResulItemInfo'
    );
    if (!TVHotelResulItemInfoElement) return;
    // TVHotelResulItemInfo exists. We have to pass this element further.

    const TVResultToursContentElement = element.querySelector(
      '.TVResultToursContent'
    );
    if (!TVResultToursContentElement) {
      return;
    }
    // TVResultToursContentElement exists ...

    const TTBodyElement = element.querySelector(
      '.TVResultToursContent t-tbody'
    );
    if (!TTBodyElement) return;
    // TTBodyElement exists ...

    const TTBodyElementObserver = new MutationObserver(
      (mutationList: MutationRecord[]) => {
        onElementChildListMutation(mutationList, (mutation) => {
          handleTTBodyElementMutation(mutation, TVHotelResulItemInfoElement);
        });
      }
    );

    TTBodyElementObserver.observe(TTBodyElement, {
      childList: true,
    });
  });
}

function handleTTBodyElementMutation(
  mutation: MutationRecord,
  hotelResultItemInfoElement: Element
) {
  // console.log('handleTTBodyElementMutation: ', mutation);

  mutation.addedNodes.forEach((node) => {
    const element = node as Element;

    if (!element.classList.contains('TVTourResultItem')) return;
    const tourResultItemElement = element;
    // TVTourResultItem exists ...

    const hasButton = Boolean(
      tourResultItemElement.querySelector('.tour-collector-button')
    );
    // if table already has button
    if (hasButton) return;

    const TTdElement = createTTdElement();
    const button = createAddButton();

    const tourOptions = collectTourOptions(
      hotelResultItemInfoElement,
      tourResultItemElement
    );
    if (!tourOptions) throw new Error('tourOptions does not exist');

    async function handleButtonClick(e: MouseEvent) {
      e.stopPropagation();

      const message: CreateTourMessage = {
        type: 'tours',
        action: 'create',
        payload: [tourOptions],
      };

      chrome.runtime.sendMessage(message, () => {
        button.classList.add('tour-collector-button--added');
        button.disabled = true;
      });

      // await addDataToTable(tourOptions);
    }

    // if this tour is already in chrome storage
    // then make button with '--added' css class and make it disabled
    // do not add event listeneres

    const message: RetrieveToursMessage = {
      type: 'tours',
      action: 'retrieve',
    };

    chrome.runtime.sendMessage(message, ({ data }) => {
      data.forEach((tour: Tour) => {
        if (tour.id === tourOptions.id) {
          button.classList.add('tour-collector-button--added');
          button.disabled = true;
          button.removeEventListener('click', handleButtonClick);
        }
      });
    });

    // getTableStateFromStorage().then(({ data }) => {
    //   data.forEach((tour) => {
    //     if (tour.id === tourOptions.id) {
    //       button.classList.add('tour-collector-button--added');
    //       button.disabled = true;
    //       button.removeEventListener('click', handleButtonClick);
    //     }
    //   });
    // });
    button.addEventListener('click', handleButtonClick);

    TTdElement.appendChild(button);
    tourResultItemElement.insertAdjacentElement('beforeend', TTdElement);
  });
}

// TODO: try to optimize this mutation
function onElementChildListMutation(
  mutationList: MutationRecord[],
  callback: (mutation: MutationRecord) => void
) {
  mutationList.forEach(function (mutation) {
    if (mutation.type === 'childList') {
      callback(mutation);
    }
  });
}
