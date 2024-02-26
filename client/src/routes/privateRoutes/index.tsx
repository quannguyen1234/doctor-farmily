import { FC, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

import { useGetLinkZoom } from '@/stores/user.store';
import { PRIVATE_ROUTES } from '@/utils/constant/routes';

interface IProtectedRoutesProps {
  isAuth: boolean;
  redirectPath: string;
  children?: JSX.Element;
}

export const ProtectedRoutes: FC<IProtectedRoutesProps> = ({
  isAuth,
  children,
  redirectPath
}) => {
  const linkZoom = useGetLinkZoom();
  const navigate = useNavigate();

  useEffect(() => {
    if (linkZoom) {
      navigate(PRIVATE_ROUTES.linkZoom);
    }
  }, [linkZoom, navigate]);

  if (!isAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
};
