import { createContext } from 'react';
import type { MenuItem } from '@order-management/shared';
import type { CartItem } from '../types/cart';

export type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  subtotalCents: number;
  addItem: (item: MenuItem) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);
