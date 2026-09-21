import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { AppHeader } from './AppHeader';
import { CartProvider, useCart } from '../../state/cart/CartContext';

function renderHeader(children = <AppHeader />) {
  return render(
    <MemoryRouter>
      <CartProvider>{children}</CartProvider>
    </MemoryRouter>
  );
}

describe('AppHeader', () => {
  test('renders logo, nav links, delivery ETA, and a cart icon', () => {
    renderHeader();

    expect(screen.getByText('Forno Rosso')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Our Menu' })).toHaveAttribute('href', '/menu');
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
    expect(screen.getByText(/Estimated delivery/i)).toBeInTheDocument();
    expect(screen.getByText('30 mins')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view cart/i })).toHaveAttribute('href', '/cart');
  });

  test('cart badge shows the total item count from cart state', () => {
    render(
      <MemoryRouter>
        <CartProvider
          initialItems={[
            { id: 'margherita', name: 'Margherita', price: 14.5, quantity: 2 },
            { id: 'diavola', name: 'Diavola', price: 16.5, quantity: 1 },
          ]}
        >
          <AppHeader />
        </CartProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('cart-badge')).toHaveTextContent('3');
  });

  test('cart badge is absent when the cart is empty', () => {
    renderHeader();

    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });

  function Harness() {
    const { addItem, removeItem } = useCart();
    return (
      <>
        <AppHeader />
        <button onClick={() => addItem({ id: 'a', name: 'A', price: 10, quantity: 2 })}>
          add
        </button>
        <button onClick={() => removeItem('a')}>remove</button>
      </>
    );
  }

  test('badge updates live as items are added and removed', async () => {
    const user = userEvent.setup();
    renderHeader(<Harness />);

    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();

    await user.click(screen.getByText('add'));
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('2');

    await user.click(screen.getByText('remove'));
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });
});
