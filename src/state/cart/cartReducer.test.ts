import { describe, expect, test } from 'vitest';
import { cartReducer, initialCartState, selectTotalItemCount } from './cartReducer';

describe('cartReducer', () => {
  test('recalculates total item count after removal and quantity change', () => {
    let state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      item: { id: 'a', name: 'A', price: 10, quantity: 2 },
    });
    state = cartReducer(state, {
      type: 'ADD_ITEM',
      item: { id: 'b', name: 'B', price: 8, quantity: 1 },
    });
    expect(selectTotalItemCount(state)).toBe(3);

    state = cartReducer(state, { type: 'UPDATE_QUANTITY', id: 'a', quantity: 5 });
    expect(selectTotalItemCount(state)).toBe(6);

    state = cartReducer(state, { type: 'REMOVE_ITEM', id: 'b' });
    expect(selectTotalItemCount(state)).toBe(5);
  });
});
