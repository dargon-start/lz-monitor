import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import errorReport from './modules/errorReport';
import test from './modules/test';
import userManagement from './modules/userManagement';

const Login = lazy(() => import('@/pages/login'));
const Page404 = lazy(() => import('@/pages/error/page-404'));

const PUBLIC_ROUTE = [
  {
    path: '/login',
    element: <Login></Login>
  },
  {
    path: '/404',
    element: <Page404></Page404>
  }
];

const NO_MATCHED_ROUTE = {
  path: '*',
  element: <Navigate to="/404" replace />
};

export const MENU_ROUTE = [userManagement, test, errorReport];

const PROTECTED_ROUTE = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />
      }
    ]
  },
  ...MENU_ROUTE
];

export default function Router() {
  const routes = [...PUBLIC_ROUTE, ...PROTECTED_ROUTE, NO_MATCHED_ROUTE];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
