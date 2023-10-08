import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';

import { useTable, useTableDispatch } from '../context/TableContext';
import { useTours, useToursDispatch } from '../context/ToursContext';

import { setClipboard, toursArrayToText } from '../helpers/helpers';

import ActionButton from './ActionButton';
import SaveButton from './SaveButton';
import { ToursMessenger } from '../../../types/chrome-extesion';
import { Tour } from '../../../types';

const TableActions = () => {
  const [copied, setCopied] = useState(false);

  const table = useTable();
  const tableDispatch = useTableDispatch();
  const tours = useTours();
  const toursDispatch = useToursDispatch();

  const handleCopyButtonClick = async () => {
    const toursToCopy = tours.filter((tour) =>
      table.selectedRows.includes(tour.id)
    );

    const text = toursArrayToText(toursToCopy);

    await setClipboard(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const handleDeleteButtonClick = async () => {
    const updatedTours = await chrome.runtime.sendMessage<
      ToursMessenger,
      Tour[]
    >({
      type: 'remove',
      data: table.selectedRows,
    });

    tableDispatch({
      type: 'update selected rows',
      selectedRows: [],
    });

    toursDispatch({
      type: 'update tours',
      tours: updatedTours,
    });
  };

  return (
    <div className="flex-initial px-3 py-2 flex justify-between">
      <div className="flex space-x-3">
        <ActionButton theme="primary" onClick={handleCopyButtonClick}>
          {copied ? (
            <>
              <ClipboardDocumentCheckIcon className="mr-1.5 h-4 w-4" />
              <span>Скопировано!</span>
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="mr-1.5 h-4 w-4" />
              <span>Скопировать!</span>
            </>
          )}
        </ActionButton>
        <ActionButton theme="danger" onClick={handleDeleteButtonClick}>
          <TrashIcon className="mr-1.5 h-4 w-4" />
          <span>Удалить</span>
        </ActionButton>
      </div>
      <div>
        <SaveButton />
      </div>
    </div>
  );
};

export default TableActions;
