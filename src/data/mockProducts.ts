// Deleza Joias - Mock Product Data
import { Product } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Anel Solitário Diamante',
    description: 'Elegante anel solitário com diamante lapidação brilhante de 1 quilate, montado em ouro branco 18k.',
    price: 350000, // R$ 3,500.00 in cents
    image_url: '/placeholder.svg',
    category: 'Anéis',
    in_stock: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Colar Pérolas Akoya',
    description: 'Refinado colar de pérolas Akoya japonesas cultivadas, fecho em ouro amarelo 18k.',
    price: 180000, // R$ 1,800.00 in cents
    image_url: '/placeholder.svg',
    category: 'Colares',
    in_stock: true,
    created_at: '2024-01-16T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z',
  },
  {
    id: '3',
    name: 'Brincos Esmeralda Colonial',
    description: 'Brincos artesanais com esmeraldas naturais e detalhes em filigrana de ouro amarelo.',
    price: 420000, // R$ 4,200.00 in cents
    image_url: '/placeholder.svg',
    category: 'Brincos',
    in_stock: true,
    created_at: '2024-01-17T00:00:00Z',
    updated_at: '2024-01-17T00:00:00Z',
  },
  {
    id: '4',
    name: 'Pulseira Tênis Diamantes',
    description: 'Pulseira tênis com diamantes em linha, total de 3 quilates, ouro branco 18k.',
    price: 890000, // R$ 8,900.00 in cents
    image_url: '/placeholder.svg',
    category: 'Pulseiras',
    in_stock: false,
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z',
  },
  {
    id: '5',
    name: 'Aliança Compromisso',
    description: 'Par de alianças de compromisso em ouro amarelo 18k, com acabamento fosco e brilhante.',
    price: 85000, // R$ 850.00 in cents
    image_url: '/placeholder.svg',
    category: 'Alianças',
    in_stock: true,
    created_at: '2024-01-19T00:00:00Z',
    updated_at: '2024-01-19T00:00:00Z',
  },
  // Test products for Stripe testing (required by instructions)
  {
    id: 'test-1',
    name: 'Produto Teste - Grátis',
    description: 'Produto para teste do sistema de pagamento.',
    price: 0, // R$ 0.00
    image_url: '/placeholder.svg',
    category: 'Teste',
    in_stock: true,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'test-2',
    name: 'Produto Teste - Centavos',
    description: 'Produto para teste com valor mínimo.',
    price: 10, // R$ 0.10
    image_url: '/placeholder.svg',
    category: 'Teste',
    in_stock: true,
    created_at: '2024-01-21T00:00:00Z',
    updated_at: '2024-01-21T00:00:00Z',
  },
  {
    id: 'test-3',
    name: 'Produto Teste - Real',
    description: 'Produto para teste com valor em real.',
    price: 100, // R$ 1.00
    image_url: '/placeholder.svg',
    category: 'Teste',
    in_stock: true,
    created_at: '2024-01-22T00:00:00Z',
    updated_at: '2024-01-22T00:00:00Z',
  },
];