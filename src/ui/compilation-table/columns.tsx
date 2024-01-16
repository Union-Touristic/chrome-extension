import { Tour } from '@/lib/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import {
  TableHeadCheckbox,
  TableRowCheckbox,
  TableRowCopyButton,
  TableRowDeleteButton,
  TableRowEditPrice,
  TableSortButton,
} from './elements';
import { getNoun, removeParenthesisAndContentInGivenString } from '@/lib/utils';
import { TdSubText } from './table-row';
import { TableCell, TableHead } from '../table';

export const columns: ColumnDef<Tour>[] = [
  // Empty column
  {
    accessorKey: 'id',
    header: (x) => (
      <TableHead className="w-9 relative">
        <TableHeadCheckbox />
      </TableHead>
    ),
    cell({ row }) {
      return (
        <TableCell className="w-9 relative">
          <TableRowCheckbox id={row.getValue('id')} />
        </TableCell>
      );
    },
  },
  // Hotel
  {
    accessorKey: 'hotel',
    header: () => (
      <TableHead className="min-w-[200px] flex-grow">Отель</TableHead>
    ),
    cell: (info) => {
      const hotel = info.getValue<Tour['hotel']>();
      const { country, region } = info.row.original;

      return (
        <TableCell className="min-w-[200px] flex-grow">
          <span className="font-medium">
            {hotel && removeParenthesisAndContentInGivenString(hotel)}
          </span>
          <TdSubText>
            {country}, {region}
          </TdSubText>
        </TableCell>
      );
    },
  },
  // From city
  {
    accessorKey: 'fromCity',
    header: () => <TableHead className="w-24">Вылет</TableHead>,
    cell: (info) => {
      const fromCity = info.getValue<Tour['fromCity']>();
      const operator = info.row.original.operator;
      return (
        <TableCell className="w-24">
          <span>{fromCity}</span>
          <TdSubText>{operator}</TdSubText>
        </TableCell>
      );
    },
  },
  // Departure Date
  {
    accessorKey: 'departureDate',
    header: () => (
      <TableHead className="w-28">
        <TableSortButton sortKey="departureDate">Заселение</TableSortButton>
      </TableHead>
    ),
    cell: (info) => {
      const nights = info.row.original.nights;
      const departureDate = info.getValue<Tour['departureDate']>();
      let noun: string | undefined;

      if (nights) noun = getNoun(nights, 'ночь', 'ночи', 'ночей');

      return (
        <TableCell className="w-28">
          <span>{departureDate}</span>
          {noun ? (
            <TdSubText>
              {nights} {noun}
            </TdSubText>
          ) : null}
        </TableCell>
      );
    },
  },
  // Board Basis
  {
    accessorKey: 'boardBasis',
    header: () => <TableHead className="w-36">Питание и номер</TableHead>,
    cell: (data) => {
      const boardBasis = data.getValue<Tour['boardBasis']>();
      const roomType = data.row.original.roomType;

      return (
        <TableCell className="w-36">
          <span>{boardBasis}</span>
          <TdSubText>{roomType}</TdSubText>
        </TableCell>
      );
    },
  },
  // Price
  {
    accessorKey: 'price',
    header: () => (
      <TableHead className="flex w-20 justify-end">
        <TableSortButton sortKey="price">Цена</TableSortButton>
      </TableHead>
    ),
    cell: (data) => {
      const tour = data.row.original;
      const currency = tour.currency;

      return (
        <TableCell className="w-20 text-right">
          <TableRowEditPrice tour={tour} />
          <TdSubText>{currency}</TdSubText>
        </TableCell>
      );
    },
  },
  // Actions
  {
    accessorKey: 'id',
    header: () => <TableHead className="w-28">Действия</TableHead>,
    cell: (data) => {
      const tour = data.row.original;
      return (
        <TableCell className="w-28 flex-row items-center justify-between">
          <div className="-ml-1.5 flex items-center space-x-2">
            <TableRowCopyButton singleTour={tour}>
              <span className="sr-only">Копировать</span>
            </TableRowCopyButton>
            <TableRowDeleteButton tourId={tour.id} className="">
              <span className="sr-only">Удалить</span>
            </TableRowDeleteButton>
          </div>
        </TableCell>
      );
    },
  },
];
