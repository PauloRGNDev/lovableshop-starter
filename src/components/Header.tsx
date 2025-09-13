// Deleza Joias - Main Header Component
import React from 'react';
import { ShoppingBag, Search, User, Menu, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

interface HeaderProps {
  onMenuClick?: () => void;
  onCartClick?: () => void;
  onSearchClick?: () => void;
  onUserClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onCartClick,
  onSearchClick,
  onUserClick,
}) => {
  const { state } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-heading font-bold text-luxury-gold">
              Deleza
            </div>
            <div className="text-sm text-muted-foreground font-light">
              JOIAS
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className="text-sm font-medium hover:text-luxury-gold transition-colors"
            >
              Início
            </a>
            <a 
              href="#products" 
              className="text-sm font-medium hover:text-luxury-gold transition-colors"
            >
              Catálogo
            </a>
            <a 
              href="#about" 
              className="text-sm font-medium hover:text-luxury-gold transition-colors"
            >
              Sobre
            </a>
            <a 
              href="#contact" 
              className="text-sm font-medium hover:text-luxury-gold transition-colors"
            >
              Contato
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClick}
              className="hidden sm:inline-flex"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Heart className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onUserClick}
            >
              <User className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingBag className="h-4 w-4" />
              {state.itemCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-luxury-gold text-luxury-black"
                >
                  {state.itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};