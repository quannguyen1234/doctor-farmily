import { FC } from 'react';

interface InputPrescriptionsProps {
  values: {
    medicineName: string;
    note: string;
  };
  onChange: any;
  index: number;
}

const InputPrescriptions: FC<InputPrescriptionsProps> = ({
  values,
  onChange,
  index
}) => {
  const { medicineName, note } = values;

  return (
    <div className='relative flex gap-2 flex-col mb-4'>
      <div className='flex flex-col'>
        <label className='font-semibold mb-1'>Tên thuốc</label>
        <input
          className='py-2 border px-2 rounded-3xl'
          value={medicineName}
          onChange={(e) => onChange(e, index)}
          type='text'
          placeholder='Nhập tên thuốc'
        />
      </div>
      <div className='flex flex-col'>
        <label className='font-semibold mb-1'>Ghi chú</label>
        <textarea
          className='py-2 border px-2 rounded-3xl'
          value={note}
          onChange={(e) => onChange(e, index)}
          placeholder='Ghi chú'
        />
      </div>
    </div>
  );
};

export default InputPrescriptions;
