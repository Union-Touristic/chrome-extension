import React from 'react';
import moment from 'moment';
import 'moment/locale/ru';

import { useTable, useTableDispatch } from '../context/TableContext';

import {
  classNames,
  getNoun,
  getStyle,
  removeParenthesisAndContentInGivenString,
} from '../helpers/helpers';

import EditPrice from './EditPrice';
import TableRowActions from './TableRowActions';
import { Squares2X2Icon } from '@heroicons/react/20/solid';
import { Tour } from '../../../types';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

type Props = {
  tour: Tour;
  snapshot: DraggableStateSnapshot;
  provided: DraggableProvided;
};

const TableRow = ({ tour, provided, snapshot }: Props) => {
  const table = useTable();
  const tableDispatch = useTableDispatch();

  let tableRowBaseClassName =
    'flex leading-4 text-xs text-gray-900 bg-white border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-0 focus:relative focus:z-20';

  if (snapshot.isDragging) {
    tableRowBaseClassName =
      'flex bg-gray-400 shadow-lg group is-dragging ring-2 ring-indigo-700 ring-offset-0 outline-none';
  } else if (snapshot.isDropAnimating) {
    tableRowBaseClassName += 'flex bg-gray-400 shadow-lg group is-dragging';
  }

  if (table.selectedRows.includes(tour.id)) {
    tableRowBaseClassName = tableRowBaseClassName.replace(
      'bg-white',
      'bg-gray-100'
    );
  }

  return (
    <tr
      className={classNames(tableRowBaseClassName, 'group/row')}
      {...provided.draggableProps}
      style={getStyle(provided.draggableProps.style, snapshot)}
      ref={provided.innerRef}
    >
      <td className="relative flex-initial w-9 pl-3 py-2 font-normal group-[.is-dragging]:text-white">
        {/* Selected row marker, only show when row is selected. */}
        {table.selectedRows.includes(tour.id) && (
          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"></div>
        )}
        <input
          type="checkbox"
          className="absolute top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 hover:cursor-pointer hover:ring-indigo-300 hover:ring-2 hover:ring-offset-2"
          checked={table.selectedRows.includes(tour.id)}
          onChange={(e) => {
            tableDispatch({
              type: 'update selected rows',
              selectedRows: e.target.checked
                ? [...table.selectedRows, tour.id]
                : table.selectedRows.filter((t) => t !== tour.id),
            });
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="flex-1 p-2 font-normal group-[.is-dragging]:text-white">
        <span className="font-medium">
          {removeParenthesisAndContentInGivenString(tour.hotelName)}
        </span>
        <br />
        <span className="text-gray-500 group-[.is-dragging]:text-gray-300">
          {tour.country}, {tour.region}
        </span>
      </td>
      <td className="flex-initial w-24 p-2 font-normal group-[.is-dragging]:text-white">
        <span>{tour.city_from}</span>
        <br />
        <span className="text-gray-500 group-[.is-dragging]:text-gray-300">
          {tour.operator}
        </span>
      </td>
      <td className="flex-initial w-28 p-2 font-normal group-[.is-dragging]:text-white">
        <span>{moment(tour.checkinDt, 'DD.MM.YYYY').format('D MMM Y')}</span>
        <br />
        <span className="text-gray-500 group-[.is-dragging]:text-gray-300">
          {tour.nights} {getNoun(Number(tour.nights), 'ночь', 'ночи', 'ночей')}
        </span>
      </td>
      <td className="flex-initial w-36 p-2 font-normal group-[.is-dragging]:text-white">
        <span>{tour.boardType}</span>
        <br />
        <span className="text-gray-500 group-[.is-dragging]:text-gray-300">
          {tour.roomType}
        </span>
      </td>
      <td className="flex-initial w-20 p-2 text-right font-normal group-[.is-dragging]:text-white">
        <EditPrice tour={tour} />
        <span className="text-gray-500 group-[.is-dragging]:text-gray-300">
          {tour.currency}
        </span>
      </td>
      <td className="flex-initial w-28 py-2 pl-2 pr-4 flex justify-between items-center group-[.is-dragging]:text-white group-[.is-dragging]:flex">
        <TableRowActions tour={tour} />
        {/* provided.dragHandleProps is making row grabbable in particular area */}
        <div
          className={classNames(
            'text-gray-400 pl-2 cursor-grab invisible group-hover/row:visible'
          )}
          {...provided.dragHandleProps}
        >
          <Squares2X2Icon className="w-2 h-2" />
          <Squares2X2Icon className="w-2 h-2" />
          <Squares2X2Icon className="w-2 h-2" />
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
