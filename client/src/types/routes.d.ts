import { FC, ReactNode } from 'react';

declare namespace React {
  function lazy<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
  ): T;
}

type Role = 0 | 1 | 2;

export interface IRoutes {
  path: string;
  page:
    | JSX.Element
    | React.LazyExoticComponent<FC<{ any }>>
    | (Element & ReactNode);
  layout?: React.Component | FC | JSX.Element | null;
  title: string;
  params?: string;
  query?: object;
  role?: Role[];
}
