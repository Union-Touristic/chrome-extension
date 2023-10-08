import React from 'react';

import { classNames } from '../helpers/helpers';

type Props = {
  children: React.ReactNode;
  icon?: any;
  className: string;
  onClick?: () => void;
};

const TableRowButton = ({
  children,
  icon,
  onClick = () => {},
  className,
}: Props) => {
  return (
    <button
      onClick={(e) => {
        // Stop bubbling because parent has event listener on click to open modal
        e.stopPropagation();
        onClick();
      }}
      className={classNames(
        'inline-flex items-center rounded border-transparent p-1.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        className
      )}
    >
      {children}
    </button>
  );
};

export default TableRowButton;
