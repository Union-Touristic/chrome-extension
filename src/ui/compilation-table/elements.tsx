import {
  cn,
  createSortConfig,
  delay,
  frenchFormatter,
  setClipboard,
  tourToText,
  toursArrayToText,
} from '@/lib/utils';
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

import type { Tour, TourInsert } from '@/lib/db/schema';
import { ToursMessenger, ToursSortConfig } from '@/lib/definitions';
import { useTable } from '@/ui/compilation-table/use-table';
import { useTours } from '@/ui/compilation-table/use-tours';
import { Loader2 } from 'lucide-react';
import { useNotification } from '@/ui/use-notification';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectedRowsChanged,
  setSortConfig,
  toggleAll,
  updateSelectedRows,
} from '@/redux/slices/tableSlice';
import { updateTours } from '@/redux/slices/toursSlice';

type TableSortButtonProps = {
  sortKey: ToursSortConfig['sortKey'];
  className?: string;
  children?: React.ReactNode;
};

export function TableSortButton({
  sortKey,
  className,
  children,
}: TableSortButtonProps) {
  const table = useAppSelector((state) => state.table);
  const data = useAppSelector((state) => state.tours.data);
  const dispatch = useAppDispatch();

  const sc = table.sortConfig;

  async function handleSortTable(sortKey: TableSortButtonProps['sortKey']) {
    const config = createSortConfig(table.sortConfig, sortKey);
    dispatch(setSortConfig(config));

    const copiedData = [...data];

    const sortedTours = copiedData.sort((a, b) => {
      const key = config.sortKey;
      // TODO: fix possible null
      if (a[key]! < b[key]!) {
        return config.direction === 'asc' ? -1 : 1;
      }
      if (a[key]! > b[key]!) {
        return config.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    await dispatch(updateTours(sortedTours));
  }

  const Icon = () => {
    if (sc) {
      if (sc.sortKey === sortKey && sc.direction === 'asc') {
        return <ChevronDownIcon className="ml-1 h-4 w-4 text-indigo-700" />;
      } else if (sc.sortKey === sortKey && sc.direction === 'dsc') {
        return <ChevronUpIcon className="ml-1 h-4 w-4 text-indigo-700" />;
      }
    }
    return <ChevronUpDownIcon className="ml-1 h-4 w-4 text-gray-500" />;
  };

  return (
    <button
      className={cn(
        'flex rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
      type="button"
      onClick={() => handleSortTable(sortKey)}
    >
      <span>{children}</span>
      <Icon />
    </button>
  );
}

export function TableHeadCheckbox() {
  const data = useAppSelector((state) => state.tours.data);
  const table = useAppSelector((state) => state.table);
  const dispatch = useAppDispatch();
  const checkbox = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isIndeterminate =
      table.selectedRows.length > 0 && table.selectedRows.length < data.length;
    dispatch(
      selectedRowsChanged({
        checked: table.selectedRows.length === data.length,
        indeterminate: isIndeterminate,
      })
    );

    if (checkbox && checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [dispatch, data.length, table.selectedRows.length]);

  const handleCheckboxChange = () => {
    const selectedRows =
      table.checked || table.indeterminate ? [] : data.map((item) => item.id);
    const checked = !table.checked && !table.indeterminate;
    dispatch(toggleAll({ selectedRows, checked, indeterminate: false }));
  };

  return (
    <input
      type="checkbox"
      className="absolute top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 hover:cursor-pointer hover:ring-2 hover:ring-blue-300 hover:ring-offset-2 focus:ring-blue-500"
      ref={checkbox}
      checked={table.checked}
      onChange={handleCheckboxChange}
    />
  );
}

type TableRowDeleteButtonProps = {
  tourId: Tour['id'];
  className?: string;
  children?: React.ReactNode;
};

export function TableRowDeleteButton({
  tourId,
  className,
  children,
}: TableRowDeleteButtonProps) {
  const { table, tableAction } = useTable();
  const { toursAction } = useTours();

  async function handleDeleteTour() {
    const updatedTours = await chrome.runtime.sendMessage<
      ToursMessenger,
      Tour[]
    >({
      type: 'remove',
      data: tourId,
    });

    toursAction({
      type: 'update tours',
      tours: updatedTours,
    });

    tableAction({
      type: 'update selected rows',
      selectedRows: table.selectedRows.filter((t) => t !== tourId),
    });
  }

  return (
    <button
      onClick={handleDeleteTour}
      className={cn(
        'rounded p-1.5 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        className
      )}
    >
      <TrashIcon
        title="Кнопка удалить"
        className="h-4 w-4"
        aria-hidden="true"
      />
      {children}
    </button>
  );
}

type TableRowCopyButtonProps = {
  singleTour: Tour;
  className?: string;
  children?: React.ReactNode;
};

export function TableRowCopyButton({
  singleTour,
  className,
}: TableRowCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyButtonClick() {
    const text = tourToText(singleTour);
    await setClipboard(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <button
      onClick={handleCopyButtonClick}
      className={cn(
        'rounded p-1.5 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
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
    </button>
  );
}

type TableTopBarDeleteButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export function TableTopBarDeleteButton({
  className,
  children,
}: TableTopBarDeleteButtonProps) {
  const { table, tableAction } = useTable();
  const { toursAction } = useTours();

  const handleDeleteButtonClick = async () => {
    const updatedTours = await chrome.runtime.sendMessage<
      ToursMessenger,
      Tour[]
    >({
      type: 'remove',
      data: table.selectedRows,
    });

    tableAction({
      type: 'update selected rows',
      selectedRows: [],
    });

    toursAction({
      type: 'update tours',
      tours: updatedTours,
    });
  };

  return (
    <button
      onClick={handleDeleteButtonClick}
      className={cn(
        'inline-flex items-center rounded-full border border-red-500 px-2 py-1 text-xs text-red-500 disabled:border-red-200 disabled:text-red-200 sm:px-3',
        className
      )}
      disabled={!table.selectedRows.length}
    >
      <TrashIcon className="mr-1.5 h-4 w-4" />
      {children}
    </button>
  );
}

type TableTopBarCopyButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export function TableTopBarCopyButton({
  className,
  children,
}: TableTopBarCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { table } = useTable();
  const { tours } = useTours();

  async function handleCopyButtonClick() {
    const toursToCopy = tours.filter((tour) =>
      table.selectedRows.includes(tour.id)
    );
    const text = toursArrayToText(toursToCopy);

    await setClipboard(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <button
      onClick={handleCopyButtonClick}
      className={cn(
        'inline-flex items-center rounded-full border border-blue-500 px-2 py-1 text-xs text-blue-500 disabled:border-blue-200 disabled:text-blue-200 sm:px-3',
        className
      )}
      disabled={!table.selectedRows.length}
    >
      <>
        {copied ? (
          <ClipboardDocumentCheckIcon className="mr-1.5 h-4 w-4" />
        ) : (
          <ClipboardDocumentIcon className="mr-1.5 h-4 w-4" />
        )}
        {children}
      </>
    </button>
  );
}

type TableRowCheckboxProps = {
  singleTour: Tour;
};

export function TableRowCheckbox({ singleTour }: TableRowCheckboxProps) {
  const table = useAppSelector((state) => state.table);
  const dispatch = useAppDispatch();

  return (
    <>
      {/* Selected row marker, only show when row is selected. */}
      {table.selectedRows.includes(singleTour.id) && (
        <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-600"></div>
      )}
      <input
        type="checkbox"
        className="absolute top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 hover:cursor-pointer hover:ring-2 hover:ring-blue-300 hover:ring-offset-2 focus:ring-blue-500"
        checked={table.selectedRows.includes(singleTour.id)}
        onChange={(e) => {
          const selectedRows = e.target.checked
            ? [...table.selectedRows, singleTour.id]
            : table.selectedRows.filter((t) => t !== singleTour.id);
          dispatch(updateSelectedRows({ selectedRows }));
        }}
      />
    </>
  );
}

type TableRowEditPriceProps = {
  tour: Tour;
};

export function TableRowEditPrice({ tour }: TableRowEditPriceProps) {
  // TODO: fix possible null
  const [price, setPrice] = useState(frenchFormatter.format(tour.price!));
  const tours = useAppSelector((state) => state.tours.data);
  const dispatch = useAppDispatch();
  const initialPriceRef = useRef(tour.price);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[\d\s]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      const priceToNumber = Number(e.target.value.replace(/\s/g, ''));
      setPrice(frenchFormatter.format(priceToNumber));
    }
  };

  const handleInputKeydown = (e: React.KeyboardEvent) => {
    if (e.code === 'Escape') {
      e.preventDefault();
      // TODO: fix types
      setPrice(frenchFormatter.format(initialPriceRef.current!));
      inputRef.current?.blur();
    }

    if (e.code === 'Tab') {
      // TODO: fix types
      setPrice(frenchFormatter.format(initialPriceRef.current!));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedPrice = Number(inputRef.current?.value.replace(/\s/g, ''));
    const toursWithChangedTour: Tour[] = tours.map((item) =>
      tour.id === item.id
        ? {
            ...item,
            price: updatedPrice,
          }
        : item
    );
    await dispatch(updateTours(toursWithChangedTour));
    inputRef.current?.blur();
  };

  return (
    <form className="cursor-pointer" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        value={price}
        onChange={handlePriceInputChange}
        className="focuse:ring-blue-500 w-16 border-0 bg-transparent p-0 text-right text-xs focus:rounded-sm focus:ring-2 focus:ring-offset-2 group-[.is-dragging]:text-white"
        onKeyDown={handleInputKeydown}
      />
    </form>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({
  children,
  disabled: isDisabled = false,
  onClick = () => {},
}: ButtonProps) {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      type="button"
      className="ml-2.5 inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium leading-4 text-blue-700 shadow-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 disabled:opacity-75 disabled:hover:bg-blue-100"
    >
      {children}
    </button>
  );
}

export function SuccessNotificationMessage() {
  return (
    <>
      Посмотреть подборку можно в CRM по{' '}
      <a
        className="underline"
        href="https://uniontouristic.vercel.app/compilations"
        onClick={async (e) => {
          e.preventDefault();
          await chrome.tabs.create({
            url: e.currentTarget.href,
          });
        }}
      >
        ссылке
      </a>
    </>
  );
}

export function UpdateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { notificationAction } = useNotification();
  const { tours, toursAction } = useTours();

  async function handleSaveButtonClick() {
    try {
      setIsLoading(true);

      // Format tour before send
      const toursToInsert: TourInsert[] = tours.map(({ id, ...rest }) => {
        return {
          ...rest,
        };
      });

      const response = await fetch(
        'https://uniontouristic.vercel.app/api/compilations',
        // 'http://localhost:8000/api/compilations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toursToInsert),
        }
      );

      await delay(300);
      setIsLoading(() => false);

      if (response.status === 201) {
        notificationAction({
          type: 'add',
          title: 'Подборка успешно сохранена',
          message: <SuccessNotificationMessage />,
        });

        await chrome.runtime.sendMessage<ToursMessenger, Tour[]>({
          type: 'update',
          data: [],
        });

        toursAction({
          type: 'update tours',
          tours: [],
        });
      }

      if (response.status === 400) {
        notificationAction({
          type: 'add error notification',
          title: 'Ошибка',
          message:
            'Неправильно отправленные данные, мы уже работаем над ее устранением. Попробуйте позднее',
        });
      }

      if (response.status === 401) {
        notificationAction({
          type: 'add error notification',
          title: 'Ошибка аутентификации',
          message: (
            <>
              Вы не вошли в CRM.
              <a
                className="underline"
                href="https://uniontouristic.vercel.app/login"
                onClick={async (e) => {
                  e.preventDefault();
                  await chrome.tabs.create({
                    url: e.currentTarget.href,
                  });
                }}
              >
                Войти
              </a>
            </>
          ),
        });
      }

      if (response.status === 500) {
        notificationAction({
          type: 'add error notification',
          title: 'Ошибка',
          message:
            'Произошла ошибка на нашей стороне. Мы уже работаем над ее устранением',
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        notificationAction({
          type: 'add error notification',
          title: 'Ошибка',
          message: JSON.stringify(error),
        });
      }
    }
  }

  return (
    <Button disabled={isLoading} onClick={handleSaveButtonClick}>
      {isLoading ? (
        <>
          <Loader2 className="mr-3 h-4 w-4 animate-spin" /> Отправка …
        </>
      ) : (
        'Сохранить в CRM'
      )}
    </Button>
  );
}
