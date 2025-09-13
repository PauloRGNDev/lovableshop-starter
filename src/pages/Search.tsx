// Deleza Joias - Search Results Page
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts, type DatabaseProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Search as SearchIcon, Filter, X, ShoppingCart, Eye, Heart } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  
  const { products, isLoading, searchProducts, refetch } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  const categories = ['all', 'anéis', 'colares', 'brincos', 'pulseiras'];

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceCents / 100);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Update URL params
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy && sortBy !== 'relevance') params.set('sort', sortBy);
    
    setSearchParams(params);

    // Perform search
    if (searchTerm.trim()) {
      await searchProducts(searchTerm);
    } else {
      refetch();
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('relevance');
    setSearchParams(new URLSearchParams());
    refetch();
  };

  const handleAddToCart = (product: DatabaseProduct) => {
    if (!product.in_stock || product.stock_quantity <= 0) {
      toast({
        title: 'Produto Indisponível',
        description: 'Este produto está fora de estoque.',
        variant: 'destructive',
      });
      return;
    }

    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price_cents,
      image_url: product.image_url || '/api/placeholder/400/400',
      category: product.category,
      in_stock: product.in_stock,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };

    addItem(cartProduct);
    toast({
      title: 'Produto Adicionado',
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesMinPrice = !minPrice || product.price_cents >= (parseInt(minPrice) * 100);
      const matchesMaxPrice = !maxPrice || product.price_cents <= (parseInt(maxPrice) * 100);
      
      return matchesCategory && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price_cents - b.price_cents;
        case 'price-high':
          return b.price_cents - a.price_cents;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'relevance':
        default:
          return 0; // Keep original order for relevance
      }
    });

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== searchTerm) {
      setSearchTerm(query);
      searchProducts(query);
    }
  }, []);

  useEffect(() => {
    handleSearch();
  }, [selectedCategory, minPrice, maxPrice, sortBy]);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    minPrice,
    maxPrice,
    sortBy !== 'relevance'
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-luxury-gold mb-2">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Buscar Joias'}
          </h1>
          <p className="text-muted-foreground">
            {filteredAndSortedProducts.length} produto{filteredAndSortedProducts.length !== 1 ? 's' : ''} encontrado{filteredAndSortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Main Search */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, categoria, material..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filtros:</span>
                </div>

                {/* Category */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.slice(1).map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Price Range */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Preço mín"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Preço máx"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-24"
                  />
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="newest">Mais recentes</SelectItem>
                    <SelectItem value="price-low">Menor preço</SelectItem>
                    <SelectItem value="price-high">Maior preço</SelectItem>
                    <SelectItem value="name">Nome (A-Z)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Limpar ({activeFiltersCount})
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Active Filters */}
        {(searchTerm || selectedCategory !== 'all' || minPrice || maxPrice) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => {
                setSearchTerm('');
                handleSearch();
              }}>
                Busca: "{searchTerm}" ✕
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} ✕
              </Badge>
            )}
            {minPrice && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setMinPrice('')}>
                Min: R$ {minPrice} ✕
              </Badge>
            )}
            {maxPrice && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setMaxPrice('')}>
                Max: R$ {maxPrice} ✕
              </Badge>
            )}
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
              <p className="text-muted-foreground">Buscando produtos...</p>
            </div>
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-luxury transition-all duration-300">
                <div className="relative">
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image_url || '/api/placeholder/400/400'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Button size="sm" variant="secondary" className="rounded-full">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="rounded-full">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                      <Badge className="bg-luxury-gold text-luxury-black">Destaque</Badge>
                    )}
                    {!product.in_stock && (
                      <Badge variant="destructive">Indisponível</Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Category */}
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>

                    {/* Product Info */}
                    <div>
                      <h3 className="font-heading font-semibold text-lg line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-luxury-gold">
                        {formatPrice(product.price_cents)}
                      </span>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.in_stock}
                        className="bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl text-muted-foreground">🔍</div>
              <h3 className="text-xl font-heading font-semibold">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os termos de busca ou os filtros para encontrar o que procura.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Sugestões:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Verifique a ortografia das palavras</li>
                  <li>• Use termos mais gerais</li>
                  <li>• Remova alguns filtros</li>
                  <li>• Tente buscar por categorias como "anel" ou "colar"</li>
                </ul>
              </div>
              <Button onClick={clearFilters} variant="outline">
                Limpar Todos os Filtros
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Search;