import React from 'react';
import styles from './Button.module.scss';

type ButtonProps = {
  onClick?: () => void;
  text: string;
  disabled?: boolean;
  className?: string;
  type?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'confirm'
    | 'cancel'
    | 'submit';
  size?: 'small' | 'medium' | 'large';
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  disabled = false,
  className = '',
  type = 'button',
  size = 'medium'
}) => {
  const buttonClass = `${styles.button} ${styles[`button-${type}`]} ${
    styles[`button-${size}`]
  } ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
