import { cityFrom } from 'lvovich';
import type { SortConfig, Tour } from '../../../types';
import {
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';

export const frenchFormatter = new Intl.NumberFormat('fr-FR');

export const getNoun = (
  number: number,
  one: string,
  two: string,
  five: string
) => {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
};

export const toursArrayToText = (tours: Array<Tour>) => {
  let text = '';

  tours.forEach((tour) => {
    text += `🌎 ${tour.country}, ${tour.region} из ${cityFrom(tour.city_from)}
🏩 Отель: ${tour.hotelName}
✈️ Вылет: ${tour.checkinDt} на ${tour.nights} ${getNoun(
      Number(tour.nights),
      'ночь',
      'ночи',
      'ночей'
    )}
🛋️ Номер: ${tour.roomType}
🥣 Питание: ${tour.boardType}
🔥 Цена: ${frenchFormatter.format(tour.price)} ${tour.currency} за тур

`;
  });

  return text.trim();
};

export const setClipboard = async (text: string) => {
  const type = 'text/plain';
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];

  await navigator.clipboard.write(data);
};

export const tourToText = (tour: Tour) => {
  let text = '';
  text += `🌎 ${tour.country}, ${tour.region} из ${cityFrom(tour.city_from)}
🏩 Отель: ${tour.hotelName}
✈️ Вылет: ${tour.checkinDt} на ${tour.nights} ${getNoun(
    Number(tour.nights),
    'ночь',
    'ночи',
    'ночей'
  )}
🛋️ Номер: ${tour.roomType}
🥣 Питание: ${tour.boardType}
🔥 Цена: ${frenchFormatter.format(tour.price)} ${tour.currency} за тур
`;

  return text.trim();
};

export const createSortConfig = (
  sortConfig: SortConfig | null,
  key: string
): SortConfig => {
  let direction: SortConfig['direction'] = 'asc';

  if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'dsc';
  }

  return { key: key, direction: direction };
};

export const getStyle = (
  style: DraggingStyle | NotDraggingStyle | undefined,
  snapshot: DraggableStateSnapshot
) => {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.2s`,
  };
};

export const classNames = (...classes: Array<string>) => {
  return classes.filter(Boolean).join(' ');
};

export const removeParenthesisAndContentInGivenString = (str: string) => {
  return str.replace(/\(.*?\)/g, '');
};
