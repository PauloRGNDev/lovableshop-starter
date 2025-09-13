// Deleza Joias - Products Hook
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseProduct {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  category: string;
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Erro ao carregar produtos');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchProducts = async (searchTerm: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Erro na busca');
      toast({
        title: 'Erro',
        description: 'Erro ao buscar produtos.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProductById = async (id: string): Promise<DatabaseProduct | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  };

  const getFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('in_stock', true)
        .limit(6);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching featured products:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    searchProducts,
    getProductById,
    getFeaturedProducts,
  };
};