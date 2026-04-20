import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MinimalLayout from 'layouts/minimalLayout';

// pages
const LoginPage = Loadable(lazy(() => import('views/auth/Login')));
const ForgotPasswordPage = Loadable(lazy(() => import('views/auth/ForgotPass')));
const RegisterPage = Loadable(lazy(() => import('views/auth/Register')));
const OtpPage = Loadable(lazy(() => import('views/auth/Otp')));


// ==============================|| PAGES ROUTES ||============================== //

const PagesRoutes = {
  element: <MinimalLayout />,
  path: '/',
  children: [
    {
      children: [
        {
          path: '/',
          element: 
            <LoginPage />
        
        },
        {
          path: '/forgot-password',
          element: 
            <ForgotPasswordPage />
        
        },
        {
          path: '/register/:locker_id',
          element: 
            <RegisterPage />
        
        },
        {
          path: '/otp-check/:locker_id',
          element: 
            <OtpPage />
        
        }
      ]
    }
  ]
};

export default PagesRoutes;
