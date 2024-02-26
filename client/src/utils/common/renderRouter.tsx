import { Fragment } from 'react';
import { Route } from 'react-router-dom';

import PageWrapper from '@/pages/PageWrapper/PageWrapper';
import { IRoutes } from '@/types/routes';
import DefaultLayout from '@/layouts/DefaultLayout/DefaultLayout';

const renderRoutes = (routes: IRoutes[]) => {
  return routes.map((route) => {
    let Layout;
    if (route.layout === undefined) {
      Layout = DefaultLayout;
    } else if (route.layout === null) {
      Layout = Fragment;
    } else {
      Layout = route.layout;
    }

    let { path } = route;

    if (route.params) {
      path = `${route.path}/${route.params}`;
    }

    return (
      <Route
        key={route.path}
        path={path}
        element={
          <Layout>
            <PageWrapper title={route.title}>{route.page}</PageWrapper>
          </Layout>
        }
      />
    );
  });
};

export default renderRoutes;
