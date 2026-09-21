import { NavLink } from 'react-router-dom';

export function AppHeaderNavLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        isActive ? 'app-header__link app-header__link--active' : 'app-header__link'
      }
    >
      {label}
    </NavLink>
  );
}
