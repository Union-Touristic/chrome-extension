import * as React from 'react';
import {
  TableTopBarCopyButton,
  TableTopBarDeleteButton,
  UpdateButton,
} from '@/ui/compilation-table/elements';

type Props = {
  children?: React.ReactNode;
};

export function TableTopBar({ children }: Props) {
  return (
    <div className="w-full flex flex-initial justify-between px-3 py-2">
      <div className="flex items-start space-x-3 sm:items-stretch">
        <TableTopBarCopyButton>
          <span className="hidden sm:inline">Скопировать в виде текста</span>
          <span className="sm:hidden">Копировать</span>
        </TableTopBarCopyButton>
        <TableTopBarDeleteButton>Удалить</TableTopBarDeleteButton>
        {children}
      </div>
      <div>
        <UpdateButton />
      </div>
    </div>
  );
}
