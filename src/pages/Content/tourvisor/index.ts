import type { Tour } from '@/lib/db/schema';
import type { ToursMessenger } from '@/lib/definitions';
import {
  collectTourOptions,
  createAddButton,
  createTTdElement,
} from './helpers';

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

    const TVHotelResultBodyContainerElement = element.querySelector(
      '.TVHotelResultBodyContainer'
    );

    if (!TVHotelResultBodyContainerElement) {
      return;
    }

    // TVHotelResultBodyContainerElement exists ...

    const TVHotelResultBodyContainerElementObserver = new MutationObserver(
      (mutationList) => {
        onElementChildListMutation(
          mutationList,
          handleTVHotelResultBodyContainerElementMutation
        );
      }
    );

    TVHotelResultBodyContainerElementObserver.observe(
      TVHotelResultBodyContainerElement,
      {
        childList: true,
      }
    );
  });
}

function handleTVHotelResultBodyContainerElementMutation(
  mutation: MutationRecord
) {
  // console.log('handleTVHotelResultBodyContainerElementMutation: ', mutation);

  mutation.addedNodes.forEach((node) => {
    const element = node as Element;

    if (!element.classList.contains('blpricesort')) return;
    // blpricesort exists ...

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

    function handleButtonClick(e: MouseEvent) {
      e.stopPropagation();

      button.classList.add('tour-collector-button--added');
      button.disabled = true;

      chrome.runtime
        .sendMessage<ToursMessenger, Tour[]>({
          type: 'add',
          data: [tourOptions],
        })
        .then((tours) => {
          console.log(tours);
        });
    }

    // if this tour already in chrome storage
    // then make button with '--added' css class and make it disabled
    // do not add event listeneres
    chrome.runtime
      .sendMessage<ToursMessenger, Tour[]>({ type: 'retrieve' })
      .then((toursInStorage) => {
        toursInStorage.forEach((tour) => {
          if (tour.id === tourOptions.id) {
            button.classList.add('tour-collector-button--added');
            button.disabled = true;
            button.removeEventListener('click', handleButtonClick);
          }
        });
      });

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
