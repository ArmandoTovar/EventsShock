// -----------IMPORTS-----------------------------------------------------------
// components
import Error from './Error';
import Layout from '../components/Layout';
import Login from './Login/Index';
import Home from './Home/Index';
import User from './User/Index';
import Events from './EventList/Index';
import CircularProgress from '../components/CircularProgress';
// dep
import { Navigate, useLocation } from 'react-router';
// hooks
import { useMe } from '../hooks/useMe';
// ----------------------------------------------------------------------

export const routes = [
  {
    path: '/',
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),

    children: [
      { element: <Navigate to="/home" />, index: true },

      {
        path: '/home',
        element: (
          <RequireAuth>
            <Home />
          </RequireAuth>
        ),
        protected: true,
      },
      {
        path: '/events',
        element: (
          <RequireAuth>
            <Events />
          </RequireAuth>
        ),
        protected: true,
      },
      {
        path: '/users',
        element: (
          <RequireAuth>
            <User />
          </RequireAuth>
        ),
        protected: true,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Error />,
  },
];
// ----------------------------------------------------------------------

export function RequireAuth({ children }) {
  const { me, loading } = useMe();
  const location = useLocation();
  if (loading) return <CircularProgress />;

  if (Number(me?.rol) === 0 && location.pathname === '/users') {
    return <Navigate to={'/home'} />;
  }
  return me !== null ? (
    <div>{children}</div>
  ) : (
    <Navigate to={'/login'} replace state={{ path: location.pathname }} />
  );
}
