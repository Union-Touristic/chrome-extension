import { Tour } from '@/lib/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import {
  TableHeadCheckbox,
  TableRowCheckbox,
  TableRowCopyButton,
  TableRowDeleteButton,
  TableRowEditPrice,
} from './elements';
import { getNoun, removeParenthesisAndContentInGivenString } from '@/lib/utils';
import { TdSubText } from './table-row';

export const columns: ColumnDef<Tour>[] = [
  // Empty column
  {
    accessorKey: 'id',
    header: () => (
      <div className="w-9 relative">
        <TableHeadCheckbox />
      </div>
    ),
    cell({ row }) {
      return (
        <div className="w-9 relative">
          <TableRowCheckbox id={row.getValue('id')} />
        </div>
      );
    },
  },
  // Hotel
  {
    accessorKey: 'hotel',
    header: () => <div className="min-w-[200px]">Отель</div>,
    cell: (info) => {
      const hotel = info.getValue<Tour['hotel']>();
      const { country, region } = info.row.original;

      return (
        <>
          <div className="min-w-[200px]">
            <span className="font-medium">
              {hotel && removeParenthesisAndContentInGivenString(hotel)}
            </span>
          </div>
          <TdSubText>
            {country}, {region}
          </TdSubText>
        </>
      );
    },
  },
  // From city
  {
    accessorKey: 'fromCity',
    header: () => <div className="w-24">Вылет</div>,
    cell: (info) => {
      const fromCity = info.getValue<Tour['fromCity']>();
      const operator = info.row.original.operator;
      return (
        <div className="w-24">
          <span>{fromCity}</span>
          <TdSubText>{operator}</TdSubText>
        </div>
      );
    },
  },
  // Departure Date
  {
    accessorKey: 'departureDate',
    header: () => (
      <div className="w-28">
        <button>Заселение</button>
      </div>
    ),
    cell: (info) => {
      const nights = info.row.original.nights;
      const departureDate = info.getValue<Tour['departureDate']>();
      let noun: string | undefined;

      if (nights) noun = getNoun(nights, 'ночь', 'ночи', 'ночей');

      return (
        <div className="w-28">
          <span>{departureDate}</span>
          {noun ? (
            <TdSubText>
              {nights} {noun}
            </TdSubText>
          ) : null}
        </div>
      );
    },
  },
  // Board Basis
  {
    accessorKey: 'boardBasis',
    header: () => <div className="w-36">Питание и номер</div>,
    cell: (data) => {
      const boardBasis = data.getValue<Tour['boardBasis']>();
      const roomType = data.row.original.roomType;

      return (
        <div className="w-36">
          <span>{boardBasis}</span>
          <TdSubText>{roomType}</TdSubText>
        </div>
      );
    },
  },
  // Price
  {
    accessorKey: 'price',
    header: () => <div className="flex w-20 justify-end">Цена</div>,
    cell: (data) => {
      const tour = data.row.original;
      const currency = tour.currency;

      return (
        <div className="w-20 text-right">
          <TableRowEditPrice tour={tour} />
          <TdSubText>{currency}</TdSubText>
        </div>
      );
    },
  },
  // Actions
  {
    accessorKey: 'id',
    header: () => <div className="w-28">Действия</div>,
    cell: (data) => {
      const tour = data.row.original;
      return (
        <div className="28 flex-row items-center justify-between">
          <div className="-ml-1.5 flex items-center space-x-2">
            <TableRowCopyButton singleTour={tour}>
              <span className="sr-only">Копировать</span>
            </TableRowCopyButton>
            <TableRowDeleteButton tourId={tour.id} className="">
              <span className="sr-only">Удалить</span>
            </TableRowDeleteButton>
          </div>
        </div>
      );
    },
  },
];
