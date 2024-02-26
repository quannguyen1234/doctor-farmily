import { useField } from 'formik';
import { FC } from 'react';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

interface InputValidationsProps extends HTMLInputElement {
  label?: string;
  type: string;
  id: string;
}

const InputValidations: FC<InputValidationsProps | any> = ({
  label,
  id,
  type,
  placeholder,
  ...passProps
}) => {
  const [field, meta] = useField(passProps);

  const isError = meta.error && meta.touched;

  const classes = isError
    ? 'bg-gray-50 rounded-full border-error border-solid border-2 px-3 py-2 caret-error focus:outline-error focus:border-error'
    : 'bg-gray-50 rounded-full border-gray-200 hover:border-primary border-solid border-2 px-3 py-2 caret-primary focus:outline-primary focus:border-primary';

  return (
    <div className='w-full flex flex-col mb-2'>
      <label className='font-medium pb-1' htmlFor={id}>
        {label}
      </label>
      <input
        className={classes}
        type={type}
        placeholder={placeholder}
        {...field}
        {...passProps}
      />
      {isError && <ErrorMessage title={meta.error} />}
    </div>
  );
};

export default InputValidations;
