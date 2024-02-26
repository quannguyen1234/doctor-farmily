import { FC } from 'react';

interface ModalProps {
  children: React.ReactNode;
  isShow: boolean;
  titleHeader?: string;
  className?: string;
}

const Modal: FC<ModalProps> = ({
  children,
  isShow,
  className,
  titleHeader = ' Nhập địa chỉ hiện tại của bạn để tiếp tục sử dụng ứng dụng'
}) => {
  return (
    <div
      id='staticModal'
      data-modal-backdrop='static'
      tabIndex={-1}
      aria-hidden={isShow}
      className={`fixed top-0 left-0 right-0 z-50 bg-gray-500 bg-opacity-60 ${
        isShow ? '' : 'hidden'
      } w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full grid items-center place-content-center ${className}`}
    >
      <div className='relative w-full max-w-2xl h-full bg-white rounded-lg max-h-[80vh] overflow-y-auto'>
        {/* Modal content */}
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          {/* Modal header */}
          <div className='flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {titleHeader}
            </h3>
          </div>
          {/* Modal body */}
          <div className='p-6 space-y-6'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
