import React from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  ResponderProvided,
} from 'react-beautiful-dnd';
import { reorder } from '../../../utils';

import { useTableDispatch } from '../context/TableContext';
import { useTours, useToursDispatch } from '../context/ToursContext';

import { classNames } from '../helpers/helpers';

import TableActions from './TableActions';
import TableHead from './TableHead';
import TableRow from './TableRow';
import { ToursMessenger } from '../../../types/chrome-extesion';
import { Tour } from '../../../types';

const Table = () => {
  const tableDispatch = useTableDispatch();
  const tours = useTours();
  const toursDispatch = useToursDispatch();

  const handleDragEnd = async (
    result: DropResult,
    provided: ResponderProvided
  ) => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    // dropped at the same place
    if (destination.index === source.index) {
      return;
    }

    tableDispatch({
      type: 'set sort config',
      config: null,
    });

    const reorderedTours = reorder(tours, source.index, destination.index);

    const updatedTours = await chrome.runtime.sendMessage<
      ToursMessenger,
      Tour[]
    >({ type: 'update', data: reorderedTours });

    toursDispatch({
      type: 'update tours',
      tours: updatedTours,
    });
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <TableActions />
        <table className="flex flex-col flex-auto overflow-y-scroll">
          <TableHead />
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <tbody
                  className={classNames(
                    'overflow-y-scroll grow relative z-10 py-1',
                    snapshot.isDraggingOver ? 'bg-indigo-200' : 'bg-white'
                  )}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tours.map((element, index, array) => (
                    <Draggable
                      key={element.id}
                      draggableId={element.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <TableRow
                          snapshot={snapshot}
                          provided={provided}
                          tour={element}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
        </table>
      </div>
    </>
  );
};

export default Table;
