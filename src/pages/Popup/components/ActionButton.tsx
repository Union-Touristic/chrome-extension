import React from 'react';

import { useTable } from '../context/TableContext';

import { classNames } from '../helpers/helpers';

type ActionButtonProps = {
  children: React.ReactNode;
  icon?: any;
  onClick?: () => void;
  theme?: 'default' | 'danger' | 'primary';
};

const ActionButton = ({
  children,
  icon,
  onClick,
  theme = 'default',
}: ActionButtonProps) => {
  const table = useTable();

  let buttonStyleActive = 'text-gray-800 border-gray-700';
  let buttonStyleDisabled = 'text-gray-200 border-gray-200';

  switch (theme) {
    case 'primary':
      buttonStyleActive = 'text-blue-500 border-blue-500';
      buttonStyleDisabled = 'text-blue-200 border-blue-200';
      break;
    case 'danger':
      buttonStyleActive = 'text-red-500 border-red-500';
      buttonStyleDisabled = 'text-red-200 border-red-200';
      break;
    default:
      break;
  }

  return (
    <button
      onClick={onClick}
      className={classNames(
        'inline-flex items-center text-xs border px-3 py-1.5 rounded-full',
        table.selectedRows.length ? buttonStyleActive : buttonStyleDisabled
      )}
      disabled={!table.selectedRows.length}
    >
      {/* {icon} */}
      {/* <span>{children}</span> */}
      {children}
    </button>
  );
};

export default ActionButton;
