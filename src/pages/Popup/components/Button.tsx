import React from 'react';
import type { HeroIcon } from '../../../types';

type ButtonProps = {
  children: React.ReactNode;
  icon?: HeroIcon;
  disabled?: boolean;
  onClick?: () => void;
};

const Button = ({
  children,
  icon: Icon,
  disabled: isDisabled = false,
  onClick = () => {},
}: ButtonProps) => {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      type="button"
      className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 ml-2.5 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 shadow-sm hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 disabled:opacity-75 disabled:hover:bg-indigo-100"
    >
      {Icon && <Icon />}
      {children}
    </button>
  );
};

export default Button;
