import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cn, reorder } from '@/lib/utils';
import { useAppDispatch } from '@/redux/hooks';
import { setSortConfig, updateTours } from '@/redux/slices/tableSlice';
import { StrictModeDroppable } from '@/ui/compilation-table/droppable';
// import { TableHeader, Thead } from '@/ui/compilation-table/table-head';
import { Td, Tr } from '@/ui/compilation-table/table-row';
import { TableTopBar } from '@/ui/compilation-table/table-top-bar';
import {
  DragDropContext,
  Draggable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/ui/table';
import { Fragment } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  data,
  columns,
}: DataTableProps<TData, TValue>) {
  const dispatch = useAppDispatch();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
    // dispatch(setSortConfig(null));
    // const reorderedData = reorder(data, source.index, destination.index);
    // dispatch(updateTours(reorderedData));
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TableTopBar />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Fragment key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Fragment>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              className={cn(
                'border-t-0 border-gray-200 bg-white text-xs leading-4 focus:relative focus:z-20 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-0',
                'group/row'
              )}
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <Fragment key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
        {/* <DragDropContext onDragEnd={handleDragEnd}>
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
        </DragDropContext> */}
      </Table>
    </div>
  );
}
