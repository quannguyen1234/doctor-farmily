import { FC } from 'react';

interface BreadcrumnsMenuProps {
  children: JSX.Element[];
}

const BreadcrumnsMenu: FC<BreadcrumnsMenuProps> = ({ children }) => {
  return (
    <nav
      className='inline-flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
      aria-label='Breadcrumb'
    >
      <ol className='inline-flex items-center space-x-1 md:space-x-3'>
        {children}
      </ol>
    </nav>
  );
};

export default BreadcrumnsMenu;
