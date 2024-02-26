import { useSearchParams } from 'react-router-dom';

export const useSearchParamsString = () => {
  const [searchParams] = useSearchParams();
  const searchParamsString = Object.fromEntries([...searchParams]);
  return searchParamsString;
};
