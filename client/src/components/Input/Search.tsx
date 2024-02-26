import { FC } from 'react';

import { IInput } from '@/types/common';
import IconWrapper from '../IconWrapper/IconWrapper';

interface SearchInput extends IInput {
  className?: string;
}

const Search: FC<SearchInput> = ({
  type = 'text',
  id,
  placeholder = '',
  leftIcon,
  rightIcon,
  className,
  ...passProps
}) => {
  return (
    <div className={` relative flex items-center w-96 ${className}`}>
      {leftIcon && (
        <IconWrapper className='absolute left-2' size='w-5'>
          {leftIcon}
        </IconWrapper>
      )}

      <input
        className=' bg-gray-200 w-full py-3 pl-10 border-2 rounded-full focus:outline-none border-gray-300'
        type={type}
        placeholder={placeholder}
        id={id}
        {...passProps}
      />

      {rightIcon && (
        <IconWrapper className='absolute right-2' size='w-5'>
          {rightIcon}
        </IconWrapper>
      )}
    </div>
  );
};

export default Search;
