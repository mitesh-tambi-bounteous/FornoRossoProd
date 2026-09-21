import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  test('renders brand blurb, social icons, kitchen hours, and location/contact', () => {
    render(<Footer />);

    expect(screen.getByText(/Artisanal wood-fired sourdough pizzas/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument();
    expect(screen.getByText('Kitchen Hours')).toBeInTheDocument();
    expect(screen.getByText('Monday - Thursday')).toBeInTheDocument();
    expect(screen.getByText('12:00 PM - 10:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Pizzeria Location')).toBeInTheDocument();
    expect(screen.getByText('(555) 392-7677')).toBeInTheDocument();
    expect(screen.getByText('ciao@fornorosso.pizza')).toBeInTheDocument();
  });
});
