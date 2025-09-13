// Deleza Joias - Product Card Component
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onWishlist,
}) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const handleAddToCart = () => {
    if (!product.in_stock) {
      toast({
        title: 'Produto Indisponível',
        description: 'Este produto está temporariamente fora de estoque.',
        variant: 'destructive',
      });
      return;
    }

    addItem(product, 1);
    toast({
      title: 'Adicionado ao carrinho',
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-elegant hover:shadow-luxury transition-all duration-300 bg-card">
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-luxury-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView?.(product)}
              className="bg-background/90 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onWishlist?.(product)}
              className="bg-background/90 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stock badge */}
        {!product.in_stock && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2"
          >
            Fora de Estoque
          </Badge>
        )}

        {/* Category badge */}
        <Badge 
          className="absolute top-2 right-2 bg-luxury-gold text-luxury-black"
        >
          {product.category}
        </Badge>
      </div>

      <CardContent className="p-4">
        {/* Product name */}
        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Product description */}
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Price and add to cart */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-heading font-bold text-luxury-gold">
            {formatPrice(product.price)}
          </div>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90 shadow-elegant"
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Comprar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};