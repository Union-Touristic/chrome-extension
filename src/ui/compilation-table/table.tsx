import type { Tour } from '@/lib/db/schema';
import { cn, reorder } from '@/lib/utils';
import { useAppDispatch } from '@/redux/hooks';
import { setSortConfig } from '@/redux/slices/tableSlice';
import { updateTours } from '@/redux/slices/toursSlice';
import { StrictModeDroppable } from '@/ui/compilation-table/droppable';
import { Thead } from '@/ui/compilation-table/table-head';
import { Tr } from '@/ui/compilation-table/table-row';
import { TableTopBar } from '@/ui/compilation-table/table-top-bar';
import {
  DragDropContext,
  Draggable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';

type Props = {
  data: Tour[];
};

export function Table({ data }: Props) {
  const dispatch = useAppDispatch();

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
    dispatch(setSortConfig(null));
    const reorderedData = reorder(data, source.index, destination.index);
    dispatch(updateTours(reorderedData));
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
                {data.map((t, index) => (
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
