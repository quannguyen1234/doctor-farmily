import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

interface IDropdownActions {
  id: string;
}

const DropdownActions: FC<IDropdownActions> = ({ id }) => {
  const [isShow, setIsShow] = useState<boolean>(false);

  return (
    <>
      <div className='relative'>
        <button
          id='dropdownDefaultButton'
          data-dropdown-toggle='dropdown'
          className='border hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          type='button'
          onClick={() => setIsShow(!isShow)}
        >
          Quản lý
          <svg
            className='w-4 h-4 ml-2'
            aria-hidden='true'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </button>
        {/* Dropdown menu */}
        <div
          id='dropdown'
          className={`z-50 ${
            !isShow && 'hidden'
          } bg-gray-100 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute right-0 text-left top-12`}
        >
          <ul
            className='py-2 text-sm text-gray-700 dark:text-gray-200'
            aria-labelledby='dropdownDefaultButton'
          >
            <li>
              <Link
                to={`/doctor/history/${id}`}
                className='block px-4 py-2 hover:bg-white dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Cập nhật bệnh án
              </Link>
            </li>
            <li>
              <a
                href='google.com'
                className='block px-4 py-2 hover:bg-white dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Hồ sơ bệnh án
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default DropdownActions;
