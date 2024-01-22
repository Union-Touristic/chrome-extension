import { clsx, type ClassValue } from 'clsx';
import type {
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
} from '@hello-pangea/dnd';
import { twMerge } from 'tailwind-merge';
import type { Tour } from '@/lib/db/schema';
import { SortingState } from '@tanstack/react-table';

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
👨‍👩‍👧 Туристы: ${tour.occupancy}
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
👨‍👩‍👧 Туристы: ${tour.occupancy}
🥣 Питание: ${tour.boardBasis}
🔥 Цена: ${frenchFormatter.format(tour.price!)} ${tour.currency} за тур
`;

  return text.trim();
}

export function reorder<ListItem>(
  list: ListItem[],
  startIndex: number,
  endIndex: number
) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export function sort<List>(list: List[], sorting: SortingState) {
  const [{ id, desc }] = sorting;
  const sortedList = list.toSorted((itemA, itemB) => {
    const fieldA = itemA[id as keyof typeof itemA];
    const fieldB = itemB[id as keyof typeof itemB];
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

  return sortedList;
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
