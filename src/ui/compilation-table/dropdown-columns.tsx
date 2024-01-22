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
        {actionsColumn && (
          <DropdownMenuCheckboxItem
            key={actionsColumn.id}
            className="capitalize"
            checked={actionsColumn.getIsVisible()}
            onCheckedChange={(value) => actionsColumn.toggleVisibility(!!value)}
          >
            Действия
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
