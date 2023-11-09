import type { Tour } from '@/lib/db/schema';
import type { ToursMessenger } from '@/lib/definitions';
import { cn, reorder } from '@/lib/utils';
import { StrictModeDroppable } from '@/ui/compilation-table/droppable';
import { Thead } from '@/ui/compilation-table/table-head';
import { Tr } from '@/ui/compilation-table/table-row';
import { TableTopBar } from '@/ui/compilation-table/table-top-bar';
import { useTable } from '@/ui/compilation-table/use-table';
import { useTours } from '@/ui/compilation-table/use-tours';
import {
  DragDropContext,
  Draggable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';

export function Table() {
  const { tours, toursAction } = useTours();
  const { tableAction } = useTable();

  async function handleDragEnd(
    result: DropResult,
    provided: ResponderProvided
  ) {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    // dropped at the same place
    if (destination.index === source.index) {
      return;
    }

    tableAction({
      type: 'set sort config',
      config: null,
    });

    const reorderedTours = reorder(tours, source.index, destination.index);

    const updatedTours = await chrome.runtime.sendMessage<
      ToursMessenger,
      Tour[]
    >({ type: 'update', data: reorderedTours });

    toursAction({
      type: 'update tours',
      tours: updatedTours,
    });
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TableTopBar />
      <table className="relative flex flex-wrap overflow-auto">
        <Thead />
        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable droppableId="droppable">
            {(provided, snapshot) => (
              <tbody
                className={cn(
                  'flex h-[min(400px,500px)] basis-full flex-wrap content-start py-1 transition-colors',
                  snapshot.isDraggingOver ? 'bg-gray-100' : 'bg-gray-50'
                )}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tours.map((t, index) => (
                  <Draggable
                    key={t.id}
                    draggableId={String(t.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Tr snapshot={snapshot} provided={provided} tour={t} />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </table>
    </div>
  );
}
