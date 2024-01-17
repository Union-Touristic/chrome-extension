import { Tour } from '@/lib/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import {
  SelectAllToursCheckbox,
  SelectTourCheckbox,
  CopyTourButton,
  DeleteTourButton,
  TourEditPrice,
  SortToursButton,
} from './elements';
import { getNoun, removeParenthesisAndContentInGivenString } from '@/lib/utils';
import { SubText } from './table-row';
import { TableCell, TableHead } from '../table';

export const columns: ColumnDef<Tour>[] = [
  // Empty column
  {
    accessorKey: 'id',
    header: () => (
      <TableHead className="w-9 relative">
        <SelectAllToursCheckbox />
      </TableHead>
    ),
    cell({ row }) {
      return (
        <TableCell className="w-9 relative">
          <SelectTourCheckbox id={row.getValue('id')} />
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
          <SubText>
            {country}, {region}
          </SubText>
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
          <SubText>{operator}</SubText>
        </TableCell>
      );
    },
  },
  // Departure Date
  {
    accessorKey: 'departureDate',
    header: () => (
      <TableHead className="w-28">
        <SortToursButton sortKey="departureDate">Заселение</SortToursButton>
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
            <SubText>
              {nights} {noun}
            </SubText>
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
          <SubText>{roomType}</SubText>
        </TableCell>
      );
    },
  },
  // Price
  {
    accessorKey: 'price',
    header: () => (
      <TableHead className="flex w-20 justify-end">
        <SortToursButton sortKey="price">Цена</SortToursButton>
      </TableHead>
    ),
    cell: (data) => {
      const tour = data.row.original;
      const currency = tour.currency;

      return (
        <TableCell className="w-20 text-right" key={tour.id + data.cell.id}>
          <TourEditPrice tour={tour} />
          <SubText>{currency}</SubText>
        </TableCell>
      );
    },
  },
  // Actions
  {
    accessorKey: 'actions',
    header: () => <TableHead className="w-28">Действия</TableHead>,
    cell: (data) => {
      const tour = data.row.original;
      return (
        <TableCell className="w-28 flex-row items-center justify-between">
          <div className="-ml-1.5 flex items-center space-x-2">
            <CopyTourButton singleTour={tour}>
              <span className="sr-only">Копировать</span>
            </CopyTourButton>
            <DeleteTourButton tourId={tour.id} className="">
              <span className="sr-only">Удалить</span>
            </DeleteTourButton>
          </div>
        </TableCell>
      );
    },
  },
];
