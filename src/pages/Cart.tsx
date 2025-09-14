// Deleza Joias - Shopping Cart Page
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Cart() {
  const { state, removeItem, updateQuantity, checkout } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast({
      title: 'Item removido',
      description: 'O produto foi removido do seu carrinho.',
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para finalizar sua compra.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    const result = await checkout();
    if (result.success) {
      navigate('/');
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-heading font-bold text-luxury-black mb-2">
                Seu carrinho está vazio
              </h1>
              <p className="text-muted-foreground">
                Adicione alguns produtos luxuosos da Deleza Joias ao seu carrinho
              </p>
            </div>
            
            <Button 
              onClick={handleContinueShopping}
              className="bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
            >
              Explorar Produtos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-luxury-black mb-2">
              Carrinho de Compras
            </h1>
            <p className="text-muted-foreground">
              {state.itemCount} {state.itemCount === 1 ? 'item' : 'itens'} no seu carrinho
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-heading font-semibold text-luxury-black">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product.category}
                        </p>
                        <p className="text-lg font-semibold text-luxury-gold mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <Badge variant="secondary" className="px-3 py-1">
                          {item.quantity}
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="font-heading text-luxury-black">
                    Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {state.items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span>{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <hr className="border-border" />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-luxury-gold">{formatPrice(state.total)}</span>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
                    >
                      Finalizar Compra
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleContinueShopping}
                      className="w-full"
                    >
                      Continuar Comprando
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}