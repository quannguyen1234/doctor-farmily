import { FC, useState } from 'react';
import { Form, Formik } from 'formik';

import Button from '@/components/Button/Button';

type SettingType = 'image' | 'text' | 'select';

interface SettingItemProps {
  title: string;
  initialValue?: string;
  type?: SettingType;
  desc?: string;
}

const InfoItem: FC<SettingItemProps> = ({
  title,
  initialValue,
  type,
  desc = ''
}) => {
  const [mode, setMode] = useState(false);
  return (
    <>
      <div className='flex flex-col  w-1/3'>
        <label
          htmlFor={title}
          className='font-semibold pb-2 px-2 fon first-letter: text-2xl'
        >
          {title}
        </label>
        <input
          id={title}
          name={title}
          value={initialValue}
          disabled
          className='pb-2 py-2 px-2 bg-white border-b-2  text-lg'
        />
      </div>
    </>
  );
};

export default InfoItem;
