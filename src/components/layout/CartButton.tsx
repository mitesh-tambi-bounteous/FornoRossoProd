import { Link } from 'react-router-dom';
import { useCart } from '../../state/cart/CartContext';
import { ShoppingCartIcon } from '../icons/Icon';

export function CartButton() {
  const { totalItemCount } = useCart();

  return (
    <Link to="/cart" className="app-header__cart-button" aria-label="View cart">
      <ShoppingCartIcon className="app-header__cart-icon" />
      {totalItemCount > 0 && (
        <span className="app-header__cart-badge" data-testid="cart-badge">
          {totalItemCount}
        </span>
      )}
    </Link>
  );
}
