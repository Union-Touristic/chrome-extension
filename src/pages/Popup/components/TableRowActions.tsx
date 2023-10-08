import React, { useState } from 'react';
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { useTable, useTableDispatch } from '../context/TableContext';
import { useToursDispatch } from '../context/ToursContext';

import { setClipboard, tourToText } from '../helpers/helpers';

import TableRowButton from './TableRowButton';
import { Tour } from '../../../types';
import { ToursMessenger } from '../../../types/chrome-extesion';

type Props = {
  tour: Tour;
};
const TableRowActions = ({ tour }: Props) => {
  const [copied, setCopied] = useState(false);
  const table = useTable();
  const tableDispatch = useTableDispatch();
  const toursDispatch = useToursDispatch();

  const handleCopyButtonClick = async () => {
    const text = tourToText(tour);

    await setClipboard(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const handleDeleteTour = async (tourId: string) => {
    const updatedTours = await chrome.runtime.sendMessage<
      ToursMessenger,
      Tour[]
    >({
      type: 'remove',
      data: tourId,
    });

    toursDispatch({
      type: 'update tours',
      tours: updatedTours,
    });

    tableDispatch({
      type: 'update selected rows',
      selectedRows: table.selectedRows.filter((t) => t !== tourId),
    });
  };

  return (
    <div className="flex items-center space-x-2 -ml-1.5">
      <TableRowButton
        className="hover:text-blue-500"
        onClick={handleCopyButtonClick}
      >
        {copied ? (
          <ClipboardDocumentCheckIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ClipboardDocumentIcon
            title="Кнопка копировать"
            className="h-4 w-4"
            aria-hidden="true"
          />
        )}
        <span className="sr-only">Копировать</span>
      </TableRowButton>
      <TableRowButton
        className="hover:text-red-500"
        onClick={() => handleDeleteTour(tour.id)}
      >
        <TrashIcon
          title="Кнопка удалить"
          className="h-4 w-4"
          aria-hidden="true"
        />
        <span className="sr-only">Удалить</span>
      </TableRowButton>
    </div>
  );
};

export default TableRowActions;
