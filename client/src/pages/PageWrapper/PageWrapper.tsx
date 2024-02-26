import { FC, Suspense } from 'react';

interface PageWrapperProps {
  title: string;
  children: JSX.Element;
}

const PageWrapper: FC<PageWrapperProps> = ({ title, children }) => {
  document.title = title;

  return (
    <>
      <Suspense fallback='...loading'>{children}</Suspense>
    </>
  );
};

export default PageWrapper;
