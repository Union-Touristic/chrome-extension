import { clsx, type ClassValue } from 'clsx';
import type {
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { twMerge } from 'tailwind-merge';
import type { Tour } from '@/lib/db/schema';
import type { ToursSortConfig } from '@/lib/definitions';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function txtCenter(
  inputString: string,
  length: number = 50,
  fillchar: string = '='
) {
  // If the input string is longer than or equal to the desired length, return it as is
  if (inputString.length >= length) {
    return inputString;
  }

  // Calculate how many characters to pad on each side
  const totalPadding = length - inputString.length;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  // Create the padded string by repeating the fill character
  const paddedString =
    fillchar.repeat(leftPadding) + inputString + fillchar.repeat(rightPadding);

  return paddedString;
}

export function generatePagination(currentPage: number, totalPages: number) {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
}

export function getNoun(
  number: number,
  one: string,
  two: string,
  five: string
) {
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
}

export const frenchFormatter = new Intl.NumberFormat('fr-FR');

export function toursArrayToText(tours: Array<Tour>) {
  let text = '';

  tours.forEach((tour) => {
    // TODO: из ${cityFrom(tour.fromCity)}
    text += `🌎 ${tour.country}, ${tour.region} из ${tour.fromCity}
🏩 Отель: ${tour.hotel}
✈️ Вылет: ${tour.departureDate} на ${tour.nights} ${getNoun(
      Number(tour.nights),
      'ночь',
      'ночи',
      'ночей'
    )}
🛋️ Номер: ${tour.roomType}
🥣 Питание: ${tour.boardBasis}
🔥 Цена: ${frenchFormatter.format(tour.price!)} ${tour.currency} за тур

`;
  });

  return text.trim();
}

export async function setClipboard(text: string) {
  const type = 'text/plain';
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];

  await navigator.clipboard.write(data);
}

export function tourToText(tour: Tour) {
  let text = '';
  // TODO: из ${cityFrom(tour.city_from)}

  text += `🌎 ${tour.country}, ${tour.region} из ${tour.fromCity}
🏩 Отель: ${tour.hotel}
✈️ Вылет: ${tour.departureDate} на ${tour.nights} ${getNoun(
    Number(tour.nights),
    'ночь',
    'ночи',
    'ночей'
  )}
🛋️ Номер: ${tour.roomType}
🥣 Питание: ${tour.boardBasis}
🔥 Цена: ${frenchFormatter.format(tour.price!)} ${tour.currency} за тур
`;

  return text.trim();
}

export function createSortConfig(
  sortConfig: ToursSortConfig | null,
  configKey: ToursSortConfig['sortKey']
): ToursSortConfig {
  let direction: ToursSortConfig['direction'] = 'asc';

  if (
    sortConfig &&
    sortConfig.sortKey === configKey &&
    sortConfig.direction === 'asc'
  ) {
    direction = 'dsc';
  }

  return { sortKey: configKey, direction: direction };
}

export function reorder(list: Tour[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export function getStyle(
  style: DraggingStyle | NotDraggingStyle | undefined,
  snapshot: DraggableStateSnapshot
) {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.2s`,
  };
}

export function removeParenthesisAndContentInGivenString(str: string) {
  return str.replace(/\(.*?\)/g, '');
}

export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
