import React, { useContext } from 'react';
import {
  ChevronUpDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';

import { TableContext } from '../context/TableContext';

const sortIconDefaultClassName = 'ml-1 w-4 h-4 text-indigo-700';

type SortIconProps = {
  field: string;
};

const SortIcon = ({ field }: SortIconProps) => {
  const table = useContext(TableContext);
  const sc = table?.sortConfig;

  if (sc) {
    if (sc.key === field && sc.direction === 'asc') {
      return <ChevronDownIcon className={sortIconDefaultClassName} />;
    } else if (sc.key === field && sc.direction === 'dsc') {
      return <ChevronUpIcon className={sortIconDefaultClassName} />;
    } else {
      return <ChevronUpDownIcon className="ml-1 w-4 h-4 text-gray-500" />;
    }
  }

  return <ChevronUpDownIcon className={sortIconDefaultClassName} />;
};

export default SortIcon;
