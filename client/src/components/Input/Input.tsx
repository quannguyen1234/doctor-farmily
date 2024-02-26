import React, { FC } from 'react';

interface CInputProps {
  id: string;
  placeholder?: string;
  type: React.HTMLInputTypeAttribute;
  name?: string;
  isError?: boolean;
}

const CInput: FC<CInputProps> = ({
  id,
  placeholder,
  type = 'text',
  name,
  isError,
  ...passProps
}) => {
  const classes = isError
    ? 'rounded-full border-gray border-solid border-2 px-3 py-2 caret-primary focus:outline-primary focus:border-primary'
    : 'rounded-full border-rose-500 border-solid border-2 px-3 py-2 caret-primary focus:outline-primary focus:border-primary';
  return (
    <input
      className={classes}
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      {...passProps}
    />
  );
};

export default CInput;
