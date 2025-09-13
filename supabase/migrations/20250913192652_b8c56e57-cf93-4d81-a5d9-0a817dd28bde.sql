-- Deleza Joias Database Schema

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'jewelry',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read, admin write)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for order_items (inherit from orders)
CREATE POLICY "Users can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create order items for their orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Create cart_items table for persistent cart
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for cart_items
CREATE POLICY "Users can manage their own cart items" 
ON public.cart_items 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_products_name_search ON public.products USING gin(to_tsvector('portuguese', name));
CREATE INDEX idx_products_description_search ON public.products USING gin(to_tsvector('portuguese', description));
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);

-- Insert sample products
INSERT INTO public.products (name, description, price_cents, image_url, category, in_stock, stock_quantity, featured) VALUES
('Anel Solitário Diamante', 'Anel clássico com diamante de 1 quilate em ouro 18k. Peça atemporal para momentos especiais.', 895000, '/api/placeholder/400/400', 'anéis', true, 5, true),
('Colar Pérolas Akoya', 'Colar elegante com pérolas Akoya genuínas. Comprimento 45cm, fecho em ouro branco.', 165000, '/api/placeholder/400/400', 'colares', true, 8, true),
('Brincos Esmeralda Vintage', 'Brincos vintage com esmeraldas colombianas e diamantes. Design art déco exclusivo.', 234000, '/api/placeholder/400/400', 'brincos', true, 3, false),
('Pulseira Tennis Dourada', 'Pulseira tennis com zircônias cúbicas premium em banho de ouro 18k. Brilho incomparável.', 89500, '/api/placeholder/400/400', 'pulseiras', true, 12, true),
('Anel Ouro Rosa', 'Anel moderno em ouro rosa 18k com detalhes minimalistas. Perfeito para o dia a dia.', 125000, '/api/placeholder/400/400', 'anéis', true, 7, false),
('Colar Corrente Veneziana', 'Corrente veneziana em ouro 18k, 60cm. Clássica e versátil para todas as ocasiões.', 198000, '/api/placeholder/400/400', 'colares', true, 6, false);