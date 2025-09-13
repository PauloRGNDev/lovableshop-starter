// Deleza Joias - Product Grid Component
import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid3X3, Grid2X2 } from 'lucide-react';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  onProductView?: (product: Product) => void;
  onProductWishlist?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductView,
  onProductWishlist,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [gridCols, setGridCols] = useState<'2' | '3'>('3');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy !== 'name';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-heading font-bold text-luxury-gold mb-2">
          Nossa Coleção
        </h2>
        <p className="text-muted-foreground">
          Descubra peças únicas criadas com amor e dedicação
        </p>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar joias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
                <SelectItem value="price-low">Menor Preço</SelectItem>
                <SelectItem value="price-high">Maior Preço</SelectItem>
                <SelectItem value="newest">Mais Recentes</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            )}
          </div>

          {/* Grid Layout Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={gridCols === '2' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridCols('2')}
              className={gridCols === '2' ? 'bg-luxury-gold text-luxury-black' : ''}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={gridCols === '3' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridCols('3')}
              className={gridCols === '3' ? 'bg-luxury-gold text-luxury-black' : ''}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count and Active Filters */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </span>
          
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span>Filtros ativos:</span>
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Busca: "{searchTerm}"
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Categoria: {selectedCategory}
                </Badge>
              )}
              {sortBy !== 'name' && (
                <Badge variant="secondary" className="text-xs">
                  Ordem: {
                    sortBy === 'price-low' ? 'Menor Preço' :
                    sortBy === 'price-high' ? 'Maior Preço' :
                    sortBy === 'newest' ? 'Mais Recentes' : sortBy
                  }
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="mx-auto h-12 w-12 mb-3" />
            <p className="text-lg">Nenhum produto encontrado</p>
            <p className="text-sm">Tente ajustar seus filtros ou termo de busca</p>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black"
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      ) : (
        <div 
          className={`grid gap-6 ${
            gridCols === '2' 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={onProductView}
              onWishlist={onProductWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};