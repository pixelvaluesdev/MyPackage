import { lazy } from 'react';
// project imports
import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';

// pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/default')));
const SamplePage = Loadable(lazy(() => import('views/pages/SamplePage')));

// utils
const UtilsTypography = Loadable(lazy(() => import('views/components/Typography')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  element: <MainLayout />,
  children: [
    {
      path: '/analytics',
      element: <DashboardDefault />
    }
  ]
};

export default MainRoutes;

