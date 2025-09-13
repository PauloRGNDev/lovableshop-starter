// Deleza Joias - Products Listing Page
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
import { Search, Filter, Grid, Grid3X3, ShoppingCart, Eye, Heart } from 'lucide-react';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [gridCols, setGridCols] = useState(3);
  
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchProducts(searchTerm);
    } else {
      refetch();
    }
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
      return matchesCategory;
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
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
      searchProducts(query);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando produtos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-luxury-gold mb-4">
            Catálogo de Joias
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa coleção exclusiva de joias finas, criadas com os melhores materiais
            e acabamento impecável para momentos especiais.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar joias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="price-low">Menor preço</SelectItem>
                  <SelectItem value="price-high">Maior preço</SelectItem>
                  <SelectItem value="name">Nome (A-Z)</SelectItem>
                </SelectContent>
              </Select>

              {/* Grid Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={gridCols === 2 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGridCols(2)}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridCols === 3 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGridCols(3)}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => {
                  setSearchTerm('');
                  refetch();
                }}>
                  Busca: "{searchTerm}" ✕
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} ✕
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredAndSortedProducts.length} produto{filteredAndSortedProducts.length !== 1 ? 's' : ''} encontrado{filteredAndSortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
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
              <div className="text-6xl text-muted-foreground">💎</div>
              <h3 className="text-xl font-heading font-semibold">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou fazer uma nova busca.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                refetch();
              }} variant="outline">
                Limpar Filtros
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Products;