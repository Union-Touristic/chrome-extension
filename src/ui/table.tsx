import { cn } from '@/lib/utils';

type TableProps = React.ComponentProps<'table'>;
export function Table({ children, className, ...props }: TableProps) {
  return (
    <table
      className={cn('relative flex flex-wrap overflow-auto', className)}
      {...props}
    >
      {children}
    </table>
  );
}

type TableHeaderProps = React.ComponentProps<'thead'>;
export function TableHeader({
  children,
  className,
  ...props
}: TableHeaderProps) {
  return (
    <thead
      className={cn('sticky top-0 z-20 flex basis-full', className)}
      {...props}
    >
      {children}
    </thead>
  );
}

type TableRowProps = React.ComponentProps<'tr'>;
export function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        'flex basis-full border-y border-gray-300 bg-gray-200 text-left text-xs text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

type TableHeadProps = React.ComponentProps<'th'>;
export function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        'shrink-0 p-2 py-3 font-medium first:pl-3 last:pr-3',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

type TableBodyProps = React.ComponentProps<'tbody'>;
export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn(
        'flex h-[min(400px,500px)] basis-full flex-wrap content-start py-1 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
}

type TableCellProps = React.ComponentProps<'td'>;
export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        'flex shrink-0 flex-col p-2 first:pl-3 last:pr-3 group-[.is-dragging]:text-white',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
