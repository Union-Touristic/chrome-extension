import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/ui/dropdown-menu';
import { Button } from '@/ui/button';
import { Table } from '@tanstack/react-table';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';

type Props<TData> = {
  children?: React.ReactNode;
  table: Table<TData>;
};

export default function DropdownColumns<TData>({ table }: Props<TData>) {
  const actionsColumn = table.getColumn('actions');
  const occupancyColumn = table.getColumn('occupancy');

  const columns = [
    { name: 'Действия', column: actionsColumn },
    { name: 'Туристы', column: occupancyColumn },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <MixerHorizontalIcon className="w-4 h-4 mr-2" /> Вид
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Показывать колонки</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((item) => {
          if (!item.column) return null;
          return (
            <DropdownMenuCheckboxItem
              key={item.column.id}
              className="capitalize"
              checked={item.column.getIsVisible()}
              onCheckedChange={(value) =>
                item.column?.toggleVisibility(!!value)
              }
            >
              {item.name}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
