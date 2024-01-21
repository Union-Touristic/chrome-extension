import * as React from 'react';
import {
  cn,
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

import type { Tour, TourInsert } from '@/lib/db/schema';
import { TourWithIdAndPrice } from '@/lib/definitions';
import { Loader2 } from 'lucide-react';
import { useNotification } from '@/ui/use-notification';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  removeTour,
  setTourPrice,
  resetTable,
} from '@/redux/slices/tableSlice';
import { Column } from '@tanstack/react-table';

type InputCheckboxProps = {
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: InputCheckboxProps['checked']) => void;
};

export function InputCheckbox({
  checked,
  onCheckedChange,
}: InputCheckboxProps) {
  const checkbox = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!checkbox.current) return;

    if (checked === true) {
      checkbox.current.checked = true;
      checkbox.current.indeterminate = false;
    } else if (checked === false) {
      checkbox.current.checked = false;
      checkbox.current.indeterminate = false;
    } else if (checked === 'indeterminate') {
      checkbox.current.checked = false;
      checkbox.current.indeterminate = true;
    }
  }, [checked]);

  return (
    <input
      type="checkbox"
      className="-mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 hover:cursor-pointer hover:ring-2 hover:ring-blue-300 hover:ring-offset-2 focus:ring-blue-500"
      ref={checkbox}
      onChange={(e) => {
        onCheckedChange(e.target.checked);
      }}
    />
  );
}

type DeleteTourButtonProps = {
  tourId: Tour['id'];
  className?: string;
  children?: React.ReactNode;
};

export function DeleteTourButton({
  tourId,
  className,
  children,
}: DeleteTourButtonProps) {
  const dispatch = useAppDispatch();

  function handleDeleteTour() {
    dispatch(removeTour(tourId));
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

type CopyTourButtonProps = {
  singleTour: Tour;
  className?: string;
  children?: React.ReactNode;
};

export function CopyTourButton({ singleTour, className }: CopyTourButtonProps) {
  const [copied, setCopied] = React.useState(false);

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
  const { rowSelection } = useAppSelector((state) => state.table);
  const dispatch = useAppDispatch();
  const rowSelectionArray = Object.entries(rowSelection);

  const handleDeleteButtonClick = async () => {
    const rowIds = rowSelectionArray.map((value) => value[0]);
    dispatch(removeTour(rowIds));
  };

  return (
    <button
      onClick={handleDeleteButtonClick}
      className={cn(
        'inline-flex items-center rounded-full border border-red-500 px-2 py-1 text-xs text-red-500 disabled:border-red-200 disabled:text-red-200 sm:px-3',
        className
      )}
      disabled={!rowSelectionArray.length}
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
  const [copied, setCopied] = React.useState(false);
  const { rowSelection, data } = useAppSelector((state) => state.table);

  const rowSelectionArray = Object.entries(rowSelection);

  async function handleCopyButtonClick() {
    const dataToCopy = data.filter(
      (item) => rowSelection[item.id]
      // table.selectedRows.includes(item.id)
    );
    const text = toursArrayToText(dataToCopy);

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
      disabled={!rowSelectionArray.length}
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

type TourEditPriceProps = TourWithIdAndPrice;

export function TourEditPrice({ id, price }: TourEditPriceProps) {
  const [value, setValue] = React.useState(frenchFormatter.format(price));
  const dispatch = useAppDispatch();
  const initialPriceRef = React.useRef(price);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[\d\s]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      const priceToNumber = Number(e.target.value.replace(/\s/g, ''));
      setValue(frenchFormatter.format(priceToNumber));
    }
  };

  const handleInputKeydown = (e: React.KeyboardEvent) => {
    if (e.code === 'Escape') {
      e.preventDefault();
      // TODO: fix types
      setValue(frenchFormatter.format(initialPriceRef.current!));
      inputRef.current?.blur();
    }

    if (e.code === 'Tab') {
      // TODO: fix types
      setValue(frenchFormatter.format(initialPriceRef.current!));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedPrice = Number(inputRef.current?.value.replace(/\s/g, ''));
    dispatch(setTourPrice({ id, price: updatedPrice }));
    inputRef.current?.blur();
  };

  return (
    <form className="cursor-pointer" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handlePriceInputChange}
        className="focus:ring-blue-500 w-16 border-0 bg-transparent p-0 text-right text-xs focus:rounded-sm focus:ring-2 focus:ring-offset-2 group-[.is-dragging]:text-white"
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
  const [isLoading, setIsLoading] = React.useState(false);
  const { notificationAction } = useNotification();
  const data = useAppSelector((state) => state.table.data);
  const dispatch = useAppDispatch();

  async function handleSaveButtonClick() {
    try {
      setIsLoading(true);

      // Format tour before send
      const toursToInsert: TourInsert[] = data.map(({ id, ...rest }) => {
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

        dispatch(resetTable());
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

export function SubText({
  className,
  children,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'text-gray-500 group-[.is-dragging]:text-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type CellWithSubtextProps = {
  text: string | null | undefined;
  textBold?: boolean;
  subtext: string | null | undefined;
  className?: string;
};
export function CellWithSubtext({
  text,
  textBold,
  subtext,
  className,
}: CellWithSubtextProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {text ? (
        <span className={cn({ 'font-medium': textBold })}>{text}</span>
      ) : null}
      {subtext ? <SubText>{subtext}</SubText> : null}
    </div>
  );
}

interface ColumnSortHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function ColumnSortHeader<TData, TValue>({
  column,
  title,
  className,
}: ColumnSortHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const direction = column.getIsSorted();

  return (
    <button
      className="flex rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      type="button"
      onClick={() => {
        column.toggleSorting(direction === 'asc');
      }}
    >
      <span>{title}</span>
      {direction === 'asc' && (
        <ChevronDownIcon className="ml-1 h-4 w-4 text-indigo-700" />
      )}
      {direction === 'desc' && (
        <ChevronUpIcon className="ml-1 h-4 w-4 text-indigo-700" />
      )}
      {direction === false && (
        <ChevronUpDownIcon className="ml-1 h-4 w-4 text-gray-500" />
      )}
    </button>
  );
}
