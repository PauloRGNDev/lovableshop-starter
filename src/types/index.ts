// Deleza Joias - TypeScript Type Definitions

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Price in cents
  image_url: string;
  category: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CartAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'CLEAR_CART';
  payload?: {
    product?: Product;
    productId?: string;
    quantity?: number;
  };
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  in_stock: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface CheckoutSessionData {
  line_items: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  success_url: string;
  cancel_url: string;
  customer_email?: string;
}