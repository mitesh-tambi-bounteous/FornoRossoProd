export type CartItem = { id: string; name: string; price: number; quantity: number };
export type CartState = { items: CartItem[] };
export type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number };

export const initialCartState: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === action.item.id
              ? { ...item, quantity: item.quantity + action.item.quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((item) => item.id !== action.id) };
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        ),
      };
    default:
      return state;
  }
}

export function selectTotalItemCount(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}
