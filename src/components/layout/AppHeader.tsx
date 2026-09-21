import { Logo } from './Logo';
import { AppHeaderNavLink } from './AppHeaderNavLink';
import { CartButton } from './CartButton';

export function AppHeader() {
  return (
    <header className="app-header">
      <Logo />
      <nav className="app-header__nav" aria-label="Main">
        <AppHeaderNavLink to="/" label="Home" />
        <AppHeaderNavLink to="/menu" label="Our Menu" />
        <AppHeaderNavLink to="/cart" label="Cart" />
      </nav>
      <div className="app-header__actions">
        <p className="app-header__eta">
          Estimated delivery: <span className="app-header__eta-value">30 mins</span>
        </p>
        <CartButton />
      </div>
    </header>
  );
}
