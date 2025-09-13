// Deleza Joias - Main E-commerce Page
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { Cart } from '@/components/Cart';
import { SignIn } from '@/components/auth/SignIn';
import { SignUp } from '@/components/auth/SignUp';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/data/mockProducts';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { LogOut, User, Settings } from 'lucide-react';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const { products: databaseProducts, isLoading: productsLoading } = useProducts();
  const { toast } = useToast();

  // Use database products if available, fallback to mock products
  const products = databaseProducts.length > 0 ? databaseProducts.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: p.price_cents,
    image_url: p.image_url || '/api/placeholder/400/400',
    category: p.category,
    in_stock: p.in_stock,
    created_at: p.created_at,
    updated_at: p.updated_at,
  })) : mockProducts;

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    toast({
      title: user ? 'Login realizado!' : 'Conta criada!',
      description: 'Bem-vindo à Deleza Joias!',
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer logout.',
        variant: 'destructive',
      });
    }
  };

  const handleProductView = (product: Product) => {
    toast({
      title: product.name,
      description: 'Visualização de produto será implementada em breve.',
    });
  };

  const handleProductWishlist = (product: Product) => {
    toast({
      title: 'Adicionado aos favoritos',
      description: `${product.name} foi salvo na sua lista de desejos.`,
    });
  };

  const handleCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      setAuthMode('signin');
      toast({
        title: 'Login necessário',
        description: 'Faça login para finalizar sua compra.',
      });
      return;
    }
    
    // TODO: Implement Stripe checkout
    toast({
      title: 'Checkout',
      description: 'Redirecionamento para pagamento será implementado.',
    });
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando Deleza Joias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onUserClick={() => {
          if (user) {
            setIsUserMenuOpen(true);
          } else {
            setIsAuthModalOpen(true);
            setAuthMode('signin');
          }
        }}
        onSearchClick={() => {
          toast({
            title: 'Busca',
            description: 'Funcionalidade de busca será implementada.',
          });
        }}
      />

      {/* Hero Section */}
      <section id="home">
        <Hero onShopNow={scrollToProducts} />
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <ProductGrid
            products={products}
            onProductView={handleProductView}
            onProductWishlist={handleProductWishlist}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-black text-luxury-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-heading font-bold text-luxury-gold mb-4">
                Deleza Joias
              </div>
              <p className="text-sm text-luxury-grey">
                Criando momentos especiais através de joias únicas e atemporais.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="hover:text-luxury-gold transition-colors">Início</a></li>
                <li><a href="#products" className="hover:text-luxury-gold transition-colors">Catálogo</a></li>
                <li><a href="#about" className="hover:text-luxury-gold transition-colors">Sobre</a></li>
                <li><a href="#contact" className="hover:text-luxury-gold transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold mb-4">Categorias</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-luxury-gold transition-colors">Anéis</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition-colors">Colares</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition-colors">Brincos</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition-colors">Pulseiras</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-luxury-grey">
                <li>contato@delezajoias.com</li>
                <li>(11) 9999-9999</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-luxury-grey/20 mt-8 pt-8 text-center text-sm text-luxury-grey">
            <p>&copy; 2024 Deleza Joias. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-heading text-luxury-gold">Carrinho de Compras</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Cart
              onCheckout={handleCheckout}
              onContinueShopping={() => setIsCartOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Auth Modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          {authMode === 'signin' ? (
            <SignIn
              onSuccess={handleAuthSuccess}
              onSwitchToSignUp={() => setAuthMode('signup')}
            />
          ) : (
            <SignUp
              onSuccess={handleAuthSuccess}
              onSwitchToSignIn={() => setAuthMode('signin')}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* User Menu Sheet */}
      {user && (
        <Sheet open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
          <SheetContent className="w-80">
            <SheetHeader>
              <SheetTitle className="font-heading text-luxury-gold">
                Minha Conta
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* User Info */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-luxury-black" />
                  </div>
                  <div>
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Options */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: 'Perfil',
                      description: 'Edição de perfil será implementada.',
                    });
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>

                {isAdmin && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      window.location.href = '/admin';
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Painel Admin
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default Index;
