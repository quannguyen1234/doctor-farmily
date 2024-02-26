import { FC } from 'react';

interface IconWrapperProps {
  children: JSX.Element;
  size?: 'w-4' | 'w-6' | 'w-5' | 'w-8' | 'w-12';
  className?: string;
}

const IconWrapper: FC<IconWrapperProps> = ({
  children,
  size = '',
  className,
  ...passProps
}) => {
  const classes = `text-gray-400 ${className} block ${size || 'w-6'}`;
  return (
    <i className={`${classes}`} {...passProps}>
      {children}
    </i>
  );
};

export default IconWrapper;
