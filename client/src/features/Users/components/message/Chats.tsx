import React from 'react';

export const Chats = () => {
  return (
    <div>
      <div className='cursor-pointer p-3 flex items-center gap-3 hover:bg-[#e3e6eb] active:bg-[#e5f3ff]'>
        <img
          className='w-12 h-12 object-cover rounded-full'
          src='https://go.yolo.vn/wp-content/uploads/2019/08/hinh-anh-cho-pomsky-dep-45.jpg'
          alt=''
        />
        {/* userchatInfor */}
        <div>
          <span className='text-lg font-medium'>Nhung</span>
          <p className='text-s text-[#65676b]'>Hello</p>
        </div>
      </div>
    </div>
  );
};
