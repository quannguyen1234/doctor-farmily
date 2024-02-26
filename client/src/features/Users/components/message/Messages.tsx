import React from 'react';
import { MessageChat } from './MessageChat';

export const Messages = () => {
  return (
    <div className='p-3 h-[calc(100%-110px)] overflow-scroll'>
      <MessageChat />
      <MessageChat />
      <MessageChat />
    </div>
  );
};
