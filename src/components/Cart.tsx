// Deleza Joias - Shopping Cart Component
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface CartProps {
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

export const Cart: React.FC<CartProps> = ({ onCheckout, onContinueShopping }) => {
  const { state, removeItem, updateQuantity } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast({
      title: 'Item Removido',
      description: 'O item foi removido do seu carrinho.',
    });
  };

  if (state.items.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-luxury">
        <CardContent className="text-center py-8">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-heading font-semibold mb-2">
            Carrinho Vazio
          </h3>
          <p className="text-muted-foreground mb-6">
            Adicione produtos ao seu carrinho para continuar
          </p>
          <Button
            onClick={onContinueShopping}
            className="bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
          >
            Ver Produtos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-luxury">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-heading text-luxury-gold">Meu Carrinho</span>
          <Badge variant="secondary" className="bg-luxury-gold text-luxury-black">
            {state.itemCount} {state.itemCount === 1 ? 'item' : 'itens'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {state.items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              {/* Product Image */}
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {product.category}
                </p>
                
                {/* Price and Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-luxury-gold">
                    {formatPrice(product.price * quantity)}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(product.id, quantity - 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-sm font-medium w-8 text-center">
                      {quantity}
                    </span>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(product.id, quantity + 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Unit price */}
                <div className="text-xs text-muted-foreground mt-1">
                  {formatPrice(product.price)} cada
                </div>
              </div>

              {/* Remove Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveItem(product.id)}
                className="text-destructive hover:text-destructive h-6 w-6 p-0 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Separator />

        {/* Cart Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatPrice(state.total)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Frete:</span>
            <span>Calculado no checkout</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span className="text-luxury-gold">{formatPrice(state.total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={onCheckout}
            className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90 shadow-elegant"
            size="lg"
          >
            Finalizar Compra
          </Button>
          
          <Button
            onClick={onContinueShopping}
            variant="outline"
            className="w-full border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black"
          >
            Continuar Comprando
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};