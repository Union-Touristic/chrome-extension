import { Tour } from '../../../types';
import { ToursMessenger } from '../../../types/chrome-extesion';
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
    if (hasButton) return;

    const TTdElement = createTTdElement();
    const button = createAddButton();

    button.addEventListener('click', (e) => {
      e.stopPropagation();

      button.classList.add('tour-collector-button--added');
      button.disabled = true;

      const tourOptions = collectTourOptions(
        hotelResultItemInfoElement,
        tourResultItemElement
      );
      if (!tourOptions) throw new Error('tourOptions does not exist');

      chrome.runtime
        .sendMessage<ToursMessenger, Tour[]>({
          type: 'add',
          data: [tourOptions],
        })
        .then((tours) => {
          console.log(tours);
        });
    });

    TTdElement.appendChild(button);
    tourResultItemElement.insertAdjacentElement('beforeend', TTdElement);
  });
}

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
