import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

const Button = ({
  children,
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
      {children}
    </button>
  );
};

export default Button;
