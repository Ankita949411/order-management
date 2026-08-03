import { useMemo, useReducer } from 'react';
import type { MenuItem } from '@order-management/shared';
import type { PropsWithChildren } from 'react';
import type { CartItem } from '../types/cart';
import { CartContext } from './cart-context';
import type { CartContextValue } from './cart-context';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; item: MenuItem }
  | { type: 'UPDATE_QUANTITY'; menuItemId: string; quantity: number }
  | { type: 'REMOVE_ITEM'; menuItemId: string }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: []
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.menuItem.id === action.item.id);

      if (!existingItem) {
        return {
          items: [...state.items, { menuItem: action.item, quantity: 1 }]
        };
      }

      return {
        items: state.items.map((item) =>
          item.menuItem.id === action.item.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((item) => item.menuItem.id !== action.menuItemId)
        };
      }

      return {
        items: state.items.map((item) =>
          item.menuItem.id === action.menuItemId ? { ...item, quantity: action.quantity } : item
        )
      };
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((item) => item.menuItem.id !== action.menuItemId)
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
    const subtotalCents = state.items.reduce(
      (total, item) => total + item.menuItem.priceCents * item.quantity,
      0
    );

    return {
      ...state,
      totalQuantity,
      subtotalCents,
      addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
      updateQuantity: (menuItemId, quantity) =>
        dispatch({ type: 'UPDATE_QUANTITY', menuItemId, quantity }),
      removeItem: (menuItemId) => dispatch({ type: 'REMOVE_ITEM', menuItemId }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' })
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
