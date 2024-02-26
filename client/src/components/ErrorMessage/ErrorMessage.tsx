import { FC } from 'react';

interface ErrorMessageProps {
  title: string | undefined;
  className?: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({
  title = '',
  className = ''
}) => {
  return (
    <span className={`${className} text-rose-500 text-xs pt-1`}>{title}</span>
  );
};

export default ErrorMessage;
