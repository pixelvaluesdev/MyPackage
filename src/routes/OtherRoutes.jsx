import { lazy } from 'react';
// project imports
import Loadable from 'components/Loadable';
import PageLayout from 'layouts/pageLayout';

// pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/default')));
const SamplePage = Loadable(lazy(() => import('views/pages/SamplePage')));

// utils
const UtilsTypography = Loadable(lazy(() => import('views/components/Typography')));

// ==============================|| MAIN ROUTES ||============================== //

const OtherRoutes = {
  path: '/',
  element: <PageLayout />,
  children: [
    {
      path: '/visualize',
      element: <SamplePage />
    }
  ]
};

export default OtherRoutes;

