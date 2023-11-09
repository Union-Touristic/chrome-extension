import { cn } from '@/lib/utils';
import {
  TableHeadCheckbox,
  TableSortButton,
} from '@/ui/compilation-table/elements';
import { ComponentProps } from 'react';

export function Thead() {
  return (
    <thead className="sticky top-0 z-20 flex basis-full">
      <tr className="flex basis-full border-y border-gray-300 bg-gray-200 text-left text-xs text-gray-900">
        <Th className="relative w-9 ">
          <TableHeadCheckbox />
        </Th>
        <Th className="min-w-[200px] flex-grow">Отель</Th>
        <Th className="w-24 ">Вылет</Th>
        <Th className="w-28 ">
          <TableSortButton sortKey="departureDate">Заселение</TableSortButton>
        </Th>
        <Th className="w-36 ">Питание и номер</Th>
        <Th className="flex w-20 justify-end">
          <TableSortButton sortKey="price">Цена</TableSortButton>
        </Th>
        <Th className="w-28">Действия</Th>
      </tr>
    </thead>
  );
}

function Th({ children, className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      scope="col"
      className={cn(
        'shrink-0 p-2 py-3 font-medium first:pl-3 last:pr-3',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}
