import React, { useEffect, useRef } from 'react';

import { useTable, useTableDispatch } from '../context/TableContext';
import { useTours, useToursDispatch } from '../context/ToursContext';

import { createSortConfig } from '../helpers/helpers';

import SortIcon from './SortIcon';
import { ToursMessenger } from '../../../types/chrome-extesion';
import { Tour } from '../../../types';

const TableHead = () => {
  const table = useTable();
  const tableDispatch = useTableDispatch();
  const tours = useTours();
  const toursDispatch = useToursDispatch();

  const checkbox = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isIndeterminate =
      table.selectedRows.length > 0 && table.selectedRows.length < tours.length;

    tableDispatch({
      type: 'selected rows changed',
      checked: table.selectedRows.length === tours.length,
      indeterminate: isIndeterminate,
    });

    if (checkbox && checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [table.selectedRows, tableDispatch, tours]);

  // const handleShortcutCmdAPressed = (e: React.KeyboardEvent) => {
  //   if (e.metaKey && e.code === 'KeyA') {
  //     e.preventDefault();
  //     tableDispatch({
  //       type: 'select all',
  //       selectedRows: tours.map((tour) => tour.id),
  //     });
  //   }
  // };

  // const handleEscapeKeyPressed = (e: React.KeyboardEvent) => {
  //   // Escape works only if modal is closed
  //   if (
  //     e.code === 'Escape' &&
  //     table.selectedRows.length > 0 &&
  //     !table.modalOpen
  //   ) {
  //     e.preventDefault();
  //     tableDispatch({
  //       type: 'toggle all',
  //       selectedRows: [],
  //       checked: false,
  //       indeterminate: false,
  //     });
  //   }

  //   // Highlighted text with mouse in cancelable
  //   if (e.code === 'Escape' && document.getSelection().toString()) {
  //     e.preventDefault();
  //     document.getSelection().empty();
  //   }
  // };

  // const handleBackspaceKeyPressed = async (e: React.KeyboardEvent) => {
  //   if (
  //     e.code === 'Backspace' &&
  //     table.selectedRows.length > 0 &&
  //     !table.modalOpen
  //   ) {
  //     e.preventDefault();

  //     const updatedTours = await chrome.runtime.sendMessage({
  //       type: 'delete selected tours',
  //       data: table.selectedRows,
  //     });

  //     tableDispatch({
  //       type: 'update selected rows',
  //       selectedRows: [],
  //     });

  //     toursDispatch({
  //       type: 'update tours',
  //       tours: updatedTours,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('keydown', handleShortcutCmdAPressed);
  //   document.addEventListener('keydown', handleEscapeKeyPressed);
  //   document.addEventListener('keydown', handleBackspaceKeyPressed);

  //   return () => {
  //     document.removeEventListener('keydown', handleShortcutCmdAPressed);
  //     document.removeEventListener('keydown', handleEscapeKeyPressed);
  //     document.removeEventListener('keydown', handleBackspaceKeyPressed);
  //   };
  // });

  const handleSortTable = async (key: string) => {
    const config = createSortConfig(table.sortConfig, key);

    tableDispatch({
      type: 'set sort config',
      config: config,
    });

    const copiedTours = [...tours];

    const sortedTours = copiedTours.sort((a, b) => {
      const key = config.key as keyof typeof a;
      if (a[key] < b[key]) {
        return config.direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return config.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    const updatedTours = await chrome.runtime.sendMessage<
      ToursMessenger,
      Tour[]
    >({
      type: 'update',
      data: sortedTours,
    });

    toursDispatch({
      type: 'update tours',
      tours: updatedTours,
    });
  };

  const handleCheckboxChange = () => {
    tableDispatch({
      type: 'toggle all',
      selectedRows:
        table.checked || table.indeterminate
          ? []
          : tours.map((tour) => tour.id),
      checked: !table.checked && !table.indeterminate,
      indeterminate: false,
    });
  };

  return (
    <thead className="bg-indigo-200 border-y border-indigo-300">
      <tr className="flex text-left text-xs text-gray-900">
        <th scope="col" className="relative flex-initial w-9 pl-3 py-3">
          <input
            type="checkbox"
            className="absolute top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 hover:cursor-pointer hover:ring-offset-2 hover:ring-2 hover:ring-indigo-300"
            ref={checkbox}
            checked={table.checked}
            onChange={handleCheckboxChange}
          />
        </th>
        <th scope="col" className="flex-1 font-medium px-2 py-3">
          Отель
        </th>
        <th scope="col" className="flex-initial w-24 font-medium px-2 py-3">
          Вылет
        </th>
        <th scope="col" className="flex-initial w-28 font-medium px-2 py-3">
          <button
            className="flex"
            type="button"
            onClick={() => handleSortTable('checkinDt')}
          >
            <span>Заселение</span>
            <SortIcon field={'checkinDt'} />
          </button>
        </th>
        <th scope="col" className="flex-initial w-36 font-medium px-2 py-3">
          Питание и номер
        </th>
        <th
          scope="col"
          className="flex-initial w-20 flex justify-end font-medium px-2 py-3"
        >
          <button
            className="flex"
            type="button"
            onClick={() => handleSortTable('price')}
          >
            <span>Цена</span>
            <SortIcon field={'price'} />
          </button>
        </th>
        <th
          scope="col"
          className="flex-initial w-28 font-medium py-3 pl-2 pr-4"
        >
          Действия
          <span className="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
  );
};

export default TableHead;
