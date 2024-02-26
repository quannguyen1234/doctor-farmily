import { FC } from 'react';
import { Link, LinkProps } from 'react-router-dom';

const CLink: FC<LinkProps> = ({ to, target, children }) => {
  return (
    <Link
      to={to}
      target={target}
      className='text-right text-primary font-medium text-sm mb-4'
    >
      {children}
    </Link>
  );
};

export default CLink;
