// Deleza Joias - Shopping Cart Context
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartState, CartAction, Product, CartItem } from '@/types';

// Initial cart state
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Cart reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (!action.payload?.product) return state;
      
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === action.payload.product!.id
      );

      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        // Add new item to cart
        newItems = [
          ...state.items,
          {
            product: action.payload.product,
            quantity: action.payload.quantity || 1,
          },
        ];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      
      const itemCount = newItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'REMOVE_ITEM': {
      if (!action.payload?.productId) return state;
      
      const newItems = state.items.filter(
        item => item.product.id !== action.payload.productId
      );
      
      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      
      const itemCount = newItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'UPDATE_QUANTITY': {
      if (!action.payload?.productId || action.payload.quantity === undefined) {
        return state;
      }

      const newItems = action.payload.quantity <= 0
        ? state.items.filter(item => item.product.id !== action.payload.productId)
        : state.items.map(item =>
            item.product.id === action.payload.productId
              ? { ...item, quantity: action.payload.quantity! }
              : item
          );

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      
      const itemCount = newItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

// Create context
interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Helper functions
  const addItem = (product: Product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity },
    });
  };

  const removeItem = (productId: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId },
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const contextValue: CartContextType = {
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};