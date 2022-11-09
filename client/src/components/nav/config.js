// -----------IMPORTS-----------------------------------------------------------
// component
import SvgColor from '../../components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

export const navConfigAdmin = [
  {
    title: 'Home',
    path: '/home',
    icon: icon('ic_analytics'),
  },
  {
    title: 'users',
    path: '/users',
    icon: icon('ic_user'),
  },
  {
    title: 'events',
    path: '/events',
    icon: icon('ic_event'),
  },
];

export const navConfig = [
  {
    title: 'Home',
    path: '/home',
    icon: icon('ic_analytics'),
  },
  {
    title: 'events',
    path: '/events',
    icon: icon('ic_event'),
  },
];
