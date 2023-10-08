import { Tour } from '../../../types';
import { MD5 } from 'crypto-js';

const TOUR_OPERATORS_MAP = {
  12: 'Pegas (KZ)',
  13: 'Anex Tour',
  15: 'TezTour',
  89: 'Kazunion (KZ)',
  90: 'Kompas (KZ)',
  93: 'FUN&SUN (TUI) (KZ)',
  95: 'Sanat (KZ)',
  125: 'Join UP!',
  127: 'ABK Tourism (KZ)',
  128: 'Calypso (KZ)',
  131: 'Selfie Travel (KZ)',
};

function getMonthNumber(month: string) {
  switch (month.substring(0, 3).toLowerCase()) {
    case 'янв':
      return 1;
    case 'фев':
      return 2;
    case 'мар':
      return 3;
    case 'апр':
      return 4;
    case 'май':
      return 5;
    case 'мая':
      return 5;
    case 'июн':
      return 6;
    case 'июл':
      return 7;
    case 'авг':
      return 8;
    case 'сен':
      return 9;
    case 'окт':
      return 10;
    case 'ноя':
      return 11;
    case 'дек':
      return 12;

    case 'jan':
      return 1;
    case 'feb':
      return 2;
    case 'mar':
      return 3;
    case 'apr':
      return 4;
    case 'may':
      return 5;
    case 'jun':
      return 6;
    case 'jul':
      return 7;
    case 'aug':
      return 8;
    case 'sep':
      return 9;
    case 'oct':
      return 10;
    case 'nov':
      return 11;
    case 'dec':
      return 12;

    default:
      throw Error('Unexpected month name: ' + month);
  }
}

function dayMonthYearToString(day: number, month: number, year: number) {
  day = day * 1;
  month = month * 1;
  year = year * 1;

  if (year < 100) {
    year = 2000 + year;
  }

  return (
    (day < 10 ? '0' : '') +
    day +
    '.' +
    (month < 10 ? '0' : '') +
    month +
    '.' +
    year
  );
}

function appendYear(trvDay: number, trvMonth: number) {
  const today = new Date();
  let year = today.getFullYear();
  const curMonth = 1 + today.getMonth();
  const curDay = today.getDate();

  if (trvMonth < curMonth || (trvMonth === curMonth && trvDay < curDay)) {
    year = year + 1;
  }

  return dayMonthYearToString(trvDay, trvMonth, year);
}

function convertToDate(d: string, m: string, y?: string | number) {
  const day = parseInt(d, 10);
  const month = getMonthNumber(m);

  if (y && typeof y === 'number') {
    return dayMonthYearToString(day, month, y);
  } else {
    return appendYear(day, month);
  }
}

function extractIntFromStr(str: string) {
  const match = str.match(/(\d+)/);

  if (match !== null) {
    return parseInt(match[1], 10);
  } else {
    return 0;
  }
}

function mapCurrencyUtil(currencyName: string) {
  const key = currencyName.trim().toUpperCase();
  const currencies = {
    BYN: 'BYN',
    '€': 'EUR',
    '£': 'GBP',
    '₸': 'KZT',
    ТНГ: 'KZT',
    '₽': 'RUB',
    РУБ: 'RUB',
    'РУБ.': 'RUB',
    'Р.': 'RUB',
    ГРН: 'UAH',
    $: 'USD',
  };

  return currencies[key as keyof typeof currencies] || key;
}

function getOperator(tourResultItemElement: Element) {
  const TVTourResultItemOperatorElement = tourResultItemElement.querySelector(
    '.TVTourResultItemOperator'
  );

  if (TVTourResultItemOperatorElement) {
    const operator = TVTourResultItemOperatorElement?.getAttribute('title');

    if (operator) return operator;
  }

  const TVTourResultItemOperatorImgElement =
    tourResultItemElement.querySelector(
      '.TVTourResultItemOperator img'
    ) as HTMLImageElement | null;

  if (TVTourResultItemOperatorImgElement) {
    const src = TVTourResultItemOperatorImgElement.src;
    const code = src.match(/logo\/(\d+)\./)?.[1];

    if (code)
      return TOUR_OPERATORS_MAP[
        Number(code) as keyof typeof TOUR_OPERATORS_MAP
      ];
  }
}

function getCountry() {
  let country =
    document.querySelector('.TVCountry') ||
    document.querySelector('.TVCountrySelect .TVMainSelectContent');
  if (country) {
    const textContent = country.textContent;
    if (textContent) return textContent.trim();
  }
}

function getRegion(hotelResultItemInfoElement: Element) {
  const TVResultItemSubTitleElement = hotelResultItemInfoElement.querySelector(
    '.TVResultItemSubTitle'
  );

  let result: string;
  let textContent: string | null | undefined;

  if (TVResultItemSubTitleElement) {
    textContent = TVResultItemSubTitleElement.textContent;
  }

  if (textContent) {
    result = textContent.split(',')[0]?.split('-')[0];
    return result;
  }
}

function getHotelName(hotelResultItemInfoElement: Element) {
  const TVResultItemTitleElement =
    hotelResultItemInfoElement.querySelector('.TVResultItemTitle');

  if (TVResultItemTitleElement) {
    const hotelName = TVResultItemTitleElement.textContent?.trim();
    return hotelName;
  }
}

function getHotelHref(hotelResultItemInfoElement: Element) {
  const TVResultItemTitleLinkElement = hotelResultItemInfoElement.querySelector(
    '.TVResultItemTitle a'
  ) as HTMLAnchorElement | null;

  if (TVResultItemTitleLinkElement) {
    const hotelHref = TVResultItemTitleLinkElement.href;

    return hotelHref.trim();
  }
}

function getThumbnail(hotelResultItemInfoElement: Element) {
  const TVResultItemImageElement =
    hotelResultItemInfoElement.querySelector('.TVResultItemImage');

  if (TVResultItemImageElement) {
    const style = window.getComputedStyle(TVResultItemImageElement);
    const url = style && style.backgroundImage;

    if (url && url.length > 7) {
      return url.slice(5, -2);
    }
  }
}

function getDescription(hotelResultItemInfoElement: Element) {
  const TVResultItemDescriptionElement =
    hotelResultItemInfoElement.querySelector('.TVResultItemDescription');

  if (TVResultItemDescriptionElement) {
    const description = TVResultItemDescriptionElement.textContent;

    if (description) return description.trim();
  }
}

function getCheckinDate(tourResultItemElement: Element) {
  const TVTourResultItemDateElement = tourResultItemElement.querySelector(
    '.TVTourResultItemDate'
  );
  let textContent: string = '';

  if (TVTourResultItemDateElement?.textContent) {
    textContent = TVTourResultItemDateElement.textContent.trim();
  }

  const [day, month] = textContent.split(' ');

  if (day && month) {
    return convertToDate(day.trim(), month.trim());
  }
}

function getNights(tourResultItemElement: Element): number | undefined {
  const TVTourResultItemNightsElement = tourResultItemElement.querySelector(
    '.TVTourResultItemNights'
  );

  if (TVTourResultItemNightsElement) {
    const textContent = TVTourResultItemNightsElement.textContent;

    if (textContent) return extractIntFromStr(textContent.trim());
  }
}

function getBoardType(tourResultItemElement: Element) {
  const TVTourResultItemMealElement = tourResultItemElement.querySelector(
    '.TVTourResultItemMeal'
  );

  if (TVTourResultItemMealElement) {
    const textContent = TVTourResultItemMealElement.textContent;

    if (textContent) return textContent.trim();
  }
}

function getRoomType(tourResultItemElement: Element) {
  const TVTourResultItemRoomElement = tourResultItemElement.querySelector(
    '.TVTourResultItemRoom'
  );

  if (TVTourResultItemRoomElement) {
    const textContent = TVTourResultItemRoomElement.textContent;

    if (textContent) return textContent;
  }
}

function getPrice(tourResultItemElement: Element) {
  const TVTourResultItemPriceValueElement = tourResultItemElement.querySelector(
    '.TVTourResultItemPriceValue'
  );

  if (TVTourResultItemPriceValueElement) {
    const textContent = TVTourResultItemPriceValueElement.textContent;

    if (textContent) return extractIntFromStr(textContent.replaceAll(' ', ''));
  }
}

function getCurrency(tourResultItemElement: Element) {
  const TVTourResultItemPriceCurrencyElement =
    tourResultItemElement.querySelector('.TVTourResultItemPriceCurrency');

  if (TVTourResultItemPriceCurrencyElement) {
    const textContent = TVTourResultItemPriceCurrencyElement.textContent;

    if (textContent) return mapCurrencyUtil(textContent.trim());
  }
}

function getCity() {
  const city =
    document.querySelector('.TVLocationButton') ||
    document.querySelector('.TVDepartureSelect .TVMainSelectContent');

  if (city) {
    const textContent = city.textContent;

    if (textContent) return textContent;
  }
}

function getOccupancy(): Tour['occupancy'] {
  const occupancy =
    document.querySelector('.TVTourists') ||
    document.querySelector('.TVTouristsSelect .TVMainSelectContent');
  let match: RegExpMatchArray | null = null;

  if (occupancy) {
    const textContent = occupancy.textContent;

    if (textContent) {
      match = textContent.match(/(\d+).*?(\d+)?/g);
    }
  }

  if (match) {
    const childAges: number[] = []; // TODO: implement childAges data structure

    return {
      adultsCount: Number(match[0]),
      childrenCount: Number(match[1]) || 0,
      childAges: childAges,
    };
  }

  return {
    adultsCount: 0,
    childrenCount: 0,
    childAges: [],
  };
}

export const collectTourOptions = (
  hotelResultItemInfoElement: Element,
  tourResultItemElement: Element
): Tour => {
  const tourWithoutId: Omit<Tour, 'id'> = {
    operator: getOperator(tourResultItemElement) || 'NotFound',
    country: getCountry() || 'NotFound',
    region: getRegion(hotelResultItemInfoElement) || 'NotFound',
    hotelName: getHotelName(hotelResultItemInfoElement) || 'NotFound',
    href: getHotelHref(hotelResultItemInfoElement) || 'NotFound',
    thumbnail: getThumbnail(hotelResultItemInfoElement) || 'NotFound',
    description: getDescription(hotelResultItemInfoElement) || 'NotFound',
    checkinDt: getCheckinDate(tourResultItemElement) || 'NotFound', //TODO: find more readable way to convert this result to Date
    nights: getNights(tourResultItemElement) || 0,
    boardType: getBoardType(tourResultItemElement) || 'NotFound',
    roomType: getRoomType(tourResultItemElement) || 'NotFound',
    price: getPrice(tourResultItemElement) || 0,
    currency: getCurrency(tourResultItemElement) || 'NotFound',
    city_from: getCity() || 'NotFound',
    occupancy: getOccupancy(),
  };

  const id = generateTourId(tourWithoutId);

  const tour: Tour = {
    ...tourWithoutId,
    id,
  };

  return tour;
};

export const createAddButton = () => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tour-collector-button';

  return button;
};

export const createTTdElement = () => {
  const TTdElement = document.createElement('t-td');

  TTdElement.style.paddingLeft = '5px';
  return TTdElement;
};

function generateTourId(tourWithoutId: Omit<Tour, 'id'>): Tour['id'] {
  const id = MD5(JSON.stringify(tourWithoutId)).toString();

  return id;
}
