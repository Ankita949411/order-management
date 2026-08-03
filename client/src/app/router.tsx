/* eslint-disable react/only-export-components */
import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoadingState } from '../components/common/LoadingState';
import { AppLayout } from '../components/layout/AppLayout';

const MenuPage = lazy(() => import('../pages/MenuPage').then((module) => ({ default: module.MenuPage })));
const CheckoutPage = lazy(() =>
  import('../pages/CheckoutPage').then((module) => ({ default: module.CheckoutPage }))
);
const OrderTrackingPage = lazy(() =>
  import('../pages/OrderTrackingPage').then((module) => ({ default: module.OrderTrackingPage }))
);

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<LoadingState />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/menu" replace />
      },
      {
        path: 'menu',
        element: withSuspense(<MenuPage />)
      },
      {
        path: 'checkout',
        element: withSuspense(<CheckoutPage />)
      },
      {
        path: 'orders/:orderId',
        element: withSuspense(<OrderTrackingPage />)
      }
    ]
  }
]);
