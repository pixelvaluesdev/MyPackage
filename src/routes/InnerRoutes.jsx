import { lazy } from 'react';
import Loadable from 'components/Loadable';
import InnerLayout from 'layouts/innerLayout';

// pages
const ProfilePage = Loadable(lazy(() => import('views/pages/ProfilePage')));
const ProfilePageEdit = Loadable(lazy(() => import('views/pages/ProfilePageEdit')));
const TransactionList = Loadable(lazy(() => import('views/pages/TransactionList')));
const CustomerList = Loadable(lazy(() => import('views/pages/CustomerList')));
const CustomerTrasactionList = Loadable(lazy(() => import('views/pages/CustomerTrasactionList')));
const UserList = Loadable(lazy(() => import('views/pages/UserList')));
const UserAdd = Loadable(lazy(() => import('views/pages/UserPageAdd')));
const UserEdit = Loadable(lazy(() => import('views/pages/UserEdit')));
const LockerAdd = Loadable(lazy(() => import('views/pages/LockerPageAdd')));
const OtpVerify = Loadable(lazy(() => import('views/pages/OtpPage')));
const VisualizePage = Loadable(lazy(() => import('views/pages/VisualizePage')));
const AllCustomerList = Loadable(lazy(() => import('views/pages/AllCustomerList')));

const InnerRoutes = {
  path: '/',
  element:
    <InnerLayout />
  ,
  children: [
    { path: '/dashboard', element: <VisualizePage /> },
    { path: '/profile', element: <ProfilePage /> },
    { path: '/profile-edit', element: <ProfilePageEdit /> },
    { path: '/transaction-list', element: <TransactionList /> },
    { path: '/all-customer-list', element: <AllCustomerList /> },
    { path: '/view-customer/:locker_id', element: <CustomerList /> },
    { path: '/locker-transaction-list/:locker_id', element: <CustomerTrasactionList /> },
    { path: '/user-list', element: <UserList /> },
    { path: '/user-add', element: <UserAdd /> },
    { path: '/user-edit/:user_id', element: <UserEdit /> },
    { path: '/locker-add', element: <LockerAdd /> },
    { path: '/verify-otp', element: <OtpVerify /> },
  ]
};

export default InnerRoutes;