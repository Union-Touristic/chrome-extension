import {
  ColumnDef,
  RowSelectionState,
  SortingState,
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cn, getStyle } from '@/lib/utils';
import { TableTopBar } from '@/ui/compilation-table/table-top-bar';
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from '@/ui/table';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from '@hello-pangea/dnd';
import { ReorderStartEndIndexes } from '@/lib/definitions';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDragEnd?: ({ startIndex, endIndex }: ReorderStartEndIndexes) => void;
  sorting: SortingState;
  onSortingChange: (updatedValue: SortingState) => void;
  getRowId: (originalRow: TData, index: number) => string;
  rowSelection: RowSelectionState;
  onRowSelectionChange: (updatedValue: RowSelectionState) => void;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  onDragEnd,
  sorting,
  onSortingChange,
  getRowId,
  rowSelection,
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updaterOrValue) => {
      const updatedValue = functionalUpdate(updaterOrValue, sorting);
      onSortingChange(updatedValue);
    },
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: (updaterOrValue) => {
      const updatedValue = functionalUpdate(updaterOrValue, rowSelection);
      onRowSelectionChange(updatedValue);
    },
    state: {
      sorting,
      rowSelection,
    },
    manualSorting: true,
    getRowId: getRowId,
  });

  async function handleDragEnd(
    result: DropResult,
    provided: ResponderProvided
  ) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) return;

    const startIndex = source.index;
    const endIndex = destination.index;

    // dropped at the same place
    if (startIndex === endIndex) return;

    onDragEnd && onDragEnd({ startIndex, endIndex });
  }

  return (
    <div>
      <TableTopBar />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <TableBody
                className={cn(
                  snapshot.isDraggingOver ? 'bg-gray-100' : 'bg-gray-50'
                )}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {table.getRowModel().rows.map((row, index) => (
                  <Draggable
                    key={row.id}
                    draggableId={row.id + index}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <TableRow
                        className={cn(
                          'border-t-0 border-gray-200 bg-white text-xs leading-4 focus:relative focus:z-20 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-0',
                          {
                            'bg-gray-100': row.getIsSelected(),
                            'is-dragging group bg-gray-400 shadow-lg outline-none ring-2 ring-blue-700 ring-offset-0':
                              snapshot.isDragging || snapshot.isDropAnimating,
                          },
                          'group/row'
                        )}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getStyle(
                          provided.draggableProps.style,
                          snapshot
                        )}
                        ref={provided.innerRef}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </DragDropContext>
      </Table>
    </div>
  );
}
