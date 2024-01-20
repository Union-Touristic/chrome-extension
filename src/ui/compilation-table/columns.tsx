import { Tour } from '@/lib/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import {
  CopyTourButton,
  DeleteTourButton,
  TourEditPrice,
  SubText,
  CellWithSubtext,
  ColumnSortHeader,
  InputCheckbox,
} from './elements';
import { getNoun, removeParenthesisAndContentInGivenString } from '@/lib/utils';

export const columns: ColumnDef<Tour>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <InputCheckbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <InputCheckbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'hotel',
    header: () => <span className="w-[200px] inline-block">Отель</span>,
    cell: ({ row }) => {
      const { country, region, hotel } = row.original;
      const text = hotel && removeParenthesisAndContentInGivenString(hotel);

      return (
        <CellWithSubtext
          className="w-[200px]"
          text={text}
          textBold
          subtext={`${country}, ${region}`}
        />
      );
    },
  },
  {
    accessorKey: 'fromCity',
    header: 'Вылет',
    cell: ({ row }) => {
      const { fromCity, operator } = row.original;
      return <CellWithSubtext text={fromCity} subtext={operator} />;
    },
  },
  {
    accessorKey: 'departureDate',
    header: ({ column }) => {
      return <ColumnSortHeader column={column} title="Заселение" />;
    },
    cell: ({ row }) => {
      const { nights, departureDate } = row.original;
      let noun: string | undefined;
      if (nights) noun = getNoun(nights, 'ночь', 'ночи', 'ночей');

      return (
        <CellWithSubtext
          text={departureDate}
          subtext={noun ? `${nights} ${noun}` : null}
        />
      );
    },
  },
  {
    accessorKey: 'boardBasis',
    header: 'Питание и номер',
    cell: ({ row }) => {
      const { roomType, boardBasis } = row.original;

      return <CellWithSubtext text={boardBasis} subtext={roomType} />;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <ColumnSortHeader column={column} title="Цена" />,
    cell: ({ row }) => {
      const { id, price, currency } = row.original;

      return (
        <div className="text-right flex flex-col" key={id}>
          {price ? <TourEditPrice id={id} price={price} /> : null}
          <SubText>{currency}</SubText>
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Действия',
    cell: ({ row }) => {
      const tour = row.original;

      return (
        <div className="flex flex-row items-center justify-between">
          <div className="-ml-1.5 flex items-center space-x-2">
            <CopyTourButton singleTour={tour}>
              <span className="sr-only">Копировать</span>
            </CopyTourButton>
            <DeleteTourButton tourId={tour.id} className="">
              <span className="sr-only">Удалить</span>
            </DeleteTourButton>
          </div>
        </div>
      );
    },
  },
];
