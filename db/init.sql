-- Deleza Joias - Database Initialization Script
-- Execute this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents
  image_url TEXT,
  category TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL, -- Price at time of purchase
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shopping_cart table
CREATE TABLE IF NOT EXISTS shopping_cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Insert seed data
INSERT INTO products (name, description, price, image_url, category, in_stock) VALUES
('Anel Solitário Diamante', 'Elegante anel solitário com diamante lapidação brilhante de 1 quilate, montado em ouro branco 18k.', 350000, '/placeholder.svg', 'Anéis', TRUE),
('Colar Pérolas Akoya', 'Refinado colar de pérolas Akoya japonesas cultivadas, fecho em ouro amarelo 18k.', 180000, '/placeholder.svg', 'Colares', TRUE),
('Brincos Esmeralda Colonial', 'Brincos artesanais com esmeraldas naturais e detalhes em filigrana de ouro amarelo.', 420000, '/placeholder.svg', 'Brincos', TRUE),
('Pulseira Tênis Diamantes', 'Pulseira tênis com diamantes em linha, total de 3 quilates, ouro branco 18k.', 890000, '/placeholder.svg', 'Pulseiras', FALSE),
('Aliança Compromisso', 'Par de alianças de compromisso em ouro amarelo 18k, com acabamento fosco e brilhante.', 85000, '/placeholder.svg', 'Alianças', TRUE),
-- Test products for Stripe
('Produto Teste - Grátis', 'Produto para teste do sistema de pagamento.', 0, '/placeholder.svg', 'Teste', TRUE),
('Produto Teste - Centavos', 'Produto para teste com valor mínimo.', 10, '/placeholder.svg', 'Teste', TRUE),
('Produto Teste - Real', 'Produto para teste com valor em real.', 100, '/placeholder.svg', 'Teste', TRUE);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view products" ON products FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can manage own cart" ON shopping_cart FOR ALL USING (auth.uid() = user_id);