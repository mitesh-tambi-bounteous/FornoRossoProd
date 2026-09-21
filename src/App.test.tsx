import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { App } from './App';
import { CartProvider } from './state/cart/CartContext';

function renderApp(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('App routing', () => {
  test('shows the home page by default at the root URL', () => {
    renderApp(['/']);

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.queryByTestId('menu-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cart-page')).not.toBeInTheDocument();
  });

  test('nav links and the cart icon navigate client-side without remounting the shell', async () => {
    const user = userEvent.setup();
    renderApp(['/']);

    const headerBefore = screen.getByRole('banner');

    await user.click(screen.getByRole('link', { name: 'Our Menu' }));
    expect(screen.getByTestId('menu-page')).toBeInTheDocument();
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    expect(screen.getByRole('banner')).toBe(headerBefore);

    await user.click(screen.getByRole('link', { name: /view cart/i }));
    expect(screen.getByTestId('cart-page')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
