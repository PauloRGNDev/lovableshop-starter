// Deleza Joias - Shopping Cart Context with Supabase Integration
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartState, CartAction, Product, CartItem } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
  loadCartFromDatabase: () => Promise<void>;
  checkout: () => Promise<{ success: boolean; orderId?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          products (
            id,
            name,
            description,
            price_cents,
            image_url,
            category
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Convert database items to cart format
      if (cartItems) {
        dispatch({ type: 'CLEAR_CART' });
        cartItems.forEach((item: any) => {
          if (item.products) {
            const product: Product = {
              id: item.products.id,
              name: item.products.name,
              description: item.products.description || '',
              price: item.products.price_cents / 100, // Convert cents to currency
              image_url: item.products.image_url || '/api/placeholder/300/300',
              category: item.products.category,
              in_stock: item.products.in_stock,
              created_at: item.products.created_at,
              updated_at: item.products.updated_at,
            };
            dispatch({
              type: 'ADD_ITEM',
              payload: { product, quantity: item.quantity },
            });
          }
        });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  // Helper functions
  const addItem = async (product: Product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity },
    });

    // Save to database if user is logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            product_id: product.id,
            quantity: quantity,
          }, {
            onConflict: 'user_id,product_id'
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error saving cart item:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível adicionar o item ao carrinho.',
          variant: 'destructive',
        });
      }
    }
  };

  const removeItem = async (productId: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId },
    });

    // Remove from database if user is logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
      } catch (error) {
        console.error('Error removing cart item:', error);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity },
    });

    // Update database if user is logged in
    if (user) {
      try {
        if (quantity <= 0) {
          await removeItem(productId);
        } else {
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', user.id)
            .eq('product_id', productId);

          if (error) throw error;
        }
      } catch (error) {
        console.error('Error updating cart item:', error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    // Clear database if user is logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const checkout = async (): Promise<{ success: boolean; orderId?: string }> => {
    if (!user || state.items.length === 0) {
      return { success: false };
    }

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_cents: Math.round(state.total * 100), // Convert to cents
          status: 'pending',
          customer_name: user.full_name,
          customer_email: user.email,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_cents: Math.round(item.product.price * 100),
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear the cart
      await clearCart();

      toast({
        title: 'Pedido realizado com sucesso!',
        description: `Pedido #${order.id.slice(0, 8)} foi criado.`,
      });

      return { success: true, orderId: order.id };
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: 'Erro no checkout',
        description: 'Não foi possível finalizar o pedido. Tente novamente.',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  const contextValue: CartContextType = {
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCartFromDatabase,
    checkout,
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