// Deleza Joias - Test Cart Page
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { mockProducts } from '@/data/mockProducts';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const TestCart = () => {
  const { addItem, clearCart, state } = useCart();
  const { toast } = useToast();

  const addTestItems = () => {
    // Add first 3 products to cart for testing
    mockProducts.slice(0, 3).forEach(product => {
      addItem(product, 1);
    });
    
    toast({
      title: 'Itens Adicionados',
      description: '3 produtos foram adicionados ao carrinho para teste.',
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" onClick={() => window.location.href = '/'} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar à Loja
          </Button>
          
          <h1 className="text-3xl font-heading font-bold text-luxury-gold mb-2">
            Teste do Carrinho
          </h1>
          <p className="text-muted-foreground">
            Página para testar funcionalidades do carrinho de compras.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Status do Carrinho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-luxury-gold">{state.itemCount}</div>
                  <div className="text-sm text-muted-foreground">Itens</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-luxury-gold">{state.items.length}</div>
                  <div className="text-sm text-muted-foreground">Produtos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-luxury-gold">
                    R$ {(state.total / 100).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações de Teste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={addTestItems}
                className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
              >
                Adicionar 3 Itens de Teste
              </Button>
              
              <Button 
                onClick={() => {
                  clearCart();
                  toast({ title: 'Carrinho Limpo', description: 'Todos os itens foram removidos.' });
                }}
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Limpar Carrinho
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                Ir para Loja
              </Button>
            </CardContent>
          </Card>

          {state.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Itens no Carrinho</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {state.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{product.name}</span>
                      <span className="text-sm font-medium">Qtd: {quantity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCart;