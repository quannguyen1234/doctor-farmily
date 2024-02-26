import { FC } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi';

interface BreadcrumnsItemProps {
  children: string | JSX.Element;
  to?: string;
  disabled?: boolean;
  icon?: JSX.Element;
}

const BreadcrumnsItem: FC<BreadcrumnsItemProps> = ({
  children,
  to = '',
  disabled = false,
  icon
}) => {
  return (
    <>
      {disabled ? (
        <li aria-current='page'>
          <div className='flex items-center'>
            <HiChevronRight className='w-6 h-6 text-gray-400' />
            <span className='ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400'>
              {children}
            </span>
          </div>
        </li>
      ) : (
        <li className='inline-flex items-center'>
          <Link
            to={to}
            className='inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white'
          >
            {!icon ? (
              <HiChevronRight className='w-6 h-6 text-gray-400' />
            ) : (
              <span className='w-4 h-4 mr-2'>{icon}</span>
            )}
            {children}
          </Link>
        </li>
      )}
    </>
  );
};

export default BreadcrumnsItem;
