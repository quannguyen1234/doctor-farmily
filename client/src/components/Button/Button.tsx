import React, { FC } from 'react';
import { LinkProps } from 'react-router-dom';

import { IButton } from '../../types/common';

interface ButtonProps extends IButton {
  onClick?: () => void;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  primary?: boolean;
  href?: string;
  className?: string;
}

const Button: FC<ButtonProps> = ({
  onClick,
  children,
  type = 'button',
  leftIcon,
  primary,
  href,
  className,
  rightIcon
}) => {
  let Comp:
    | keyof JSX.IntrinsicElements
    | React.ForwardRefExoticComponent<
        LinkProps & React.RefAttributes<HTMLAnchorElement>
      > = 'button';

  if (href) {
    Comp = 'a';
  }

  const classes = primary
    ? 'text-white ring-2 ring-primary bg-primary rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:opacity-90'
    : 'ttext-slate-300 ring-2 bg-white ring-gray-300 rounded-full px-4 py-2 mb-3 font-semibold text-lg hover:bg-gray-50';

  return (
    <Comp className={`${classes} ${className}`} type={type} onClick={onClick}>
      {leftIcon && <span>{leftIcon}</span>}
      {children}
      {rightIcon && <span>{rightIcon}</span>}
    </Comp>
  );
};

export default Button;
