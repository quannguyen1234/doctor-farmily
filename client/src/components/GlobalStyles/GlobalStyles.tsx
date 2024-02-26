import './GlobalStyles.css';

type Props = {
  children: JSX.Element;
};

const GlobalStyles = ({ children }: Props) => {
  return <div className='min-h-screen w-full'>{children}</div>;
};

export default GlobalStyles;
