// Deleza Joias - Admin Product Form Component
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, X } from 'lucide-react';
import { type DatabaseProduct } from '@/hooks/useProducts';

interface AdminProductFormProps {
  product?: DatabaseProduct | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_cents: 0,
    image_url: '',
    category: 'anéis',
    in_stock: true,
    stock_quantity: 0,
    featured: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price_cents: product.price_cents,
        image_url: product.image_url || '',
        category: product.category,
        in_stock: product.in_stock,
        stock_quantity: product.stock_quantity,
        featured: product.featured,
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPrice = (priceCents: number) => {
    return (priceCents / 100).toFixed(2);
  };

  const parsePrice = (priceString: string) => {
    return Math.round(parseFloat(priceString || '0') * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price_cents: formData.price_cents,
        image_url: formData.image_url.trim() || null,
        category: formData.category,
        in_stock: formData.in_stock,
        stock_quantity: formData.stock_quantity,
        featured: formData.featured,
      };

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;

        toast({
          title: 'Produto Atualizado',
          description: 'O produto foi atualizado com sucesso.',
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: 'Produto Criado',
          description: 'O produto foi criado com sucesso.',
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o produto.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-heading text-luxury-gold">
          {product ? 'Editar Produto' : 'Novo Produto'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Anel Solitário Diamante"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva os detalhes do produto..."
              rows={4}
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formatPrice(formData.price_cents)}
                onChange={(e) => handleInputChange('price_cents', parsePrice(e.target.value))}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anéis">Anéis</SelectItem>
                  <SelectItem value="colares">Colares</SelectItem>
                  <SelectItem value="brincos">Brincos</SelectItem>
                  <SelectItem value="pulseiras">Pulseiras</SelectItem>
                  <SelectItem value="relógios">Relógios</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock Quantity */}
          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Quantidade em Estoque *</Label>
            <Input
              id="stock_quantity"
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
              placeholder="0"
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">URL da Imagem</Label>
            <div className="space-y-3">
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              
              {formData.image_url && (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                <p>Para imagens locais, você pode usar placeholders como:</p>
                <p className="font-mono text-xs">/api/placeholder/400/400</p>
              </div>
            </div>
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="in_stock">Produto Disponível</Label>
                <p className="text-sm text-muted-foreground">
                  O produto está disponível para venda
                </p>
              </div>
              <Switch
                id="in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => handleInputChange('in_stock', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Produto em Destaque</Label>
                <p className="text-sm text-muted-foreground">
                  Exibir este produto na seção de destaques
                </p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                product ? 'Atualizar' : 'Criar Produto'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};