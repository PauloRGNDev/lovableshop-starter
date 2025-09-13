// Deleza Joias - Product Detail Page
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProducts, type DatabaseProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Star,
  Shield,
  Truck,
  RotateCcw
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<DatabaseProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { getProductById } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const productData = await getProductById(id);
      
      if (productData) {
        setProduct(productData);
      } else {
        toast({
          title: 'Produto não encontrado',
          description: 'O produto que você procura não existe.',
          variant: 'destructive',
        });
        navigate('/products');
      }
      setIsLoading(false);
    };

    loadProduct();
  }, [id]);

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceCents / 100);
  };

  const handleAddToCart = () => {
    if (!product) return;

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

    addItem(cartProduct, quantity);
    toast({
      title: 'Produto Adicionado',
      description: `${quantity}x ${product.name} adicionado ao carrinho.`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copiado',
        description: 'O link do produto foi copiado para a área de transferência.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando produto...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Mock additional images (in a real app, these would come from the database)
  const productImages = [
    product.image_url || '/api/placeholder/600/600',
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} - Deleza Joias</title>
        <meta name="description" content={product.description || `${product.name} - Joia exclusiva da Deleza Joias`} />
        <meta property="og:title" content={`${product.name} - Deleza Joias`} />
        <meta property="og:description" content={product.description || ''} />
        <meta property="og:image" content={product.image_url || ''} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`${window.location.origin}/products/${product.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.image_url,
            "sku": product.id,
            "category": product.category,
            "offers": {
              "@type": "Offer",
              "price": product.price_cents / 100,
              "priceCurrency": "BRL",
              "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <Card className="overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-luxury-gold' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline">{product.category}</Badge>
                  {product.featured && (
                    <Badge className="bg-luxury-gold text-luxury-black">Destaque</Badge>
                  )}
                  {!product.in_stock && (
                    <Badge variant="destructive">Indisponível</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-heading font-bold text-luxury-gold mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold text-luxury-gold">
                    {formatPrice(product.price_cents)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Em estoque: {product.stock_quantity} unidades
                  </div>
                </div>

                {/* Rating (Mock) */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4 ? 'fill-luxury-gold text-luxury-gold' : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(127 avaliações)</span>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold mb-3">Descrição</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || 'Descrição não disponível.'}
                  </p>
                </CardContent>
              </Card>

              {/* Quantity and Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Quantity Selector */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Quantidade
                      </label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="font-medium px-4">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                          disabled={quantity >= product.stock_quantity}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleAddToCart}
                        disabled={!product.in_stock || product.stock_quantity <= 0}
                        className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
                        size="lg"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Adicionar ao Carrinho
                      </Button>

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1">
                          <Heart className="h-4 w-4 mr-2" />
                          Favoritar
                        </Button>
                        <Button variant="outline" onClick={handleShare}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold mb-4">Benefícios Deleza Joias</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-luxury-gold flex-shrink-0" />
                      <span className="text-sm">Certificado de autenticidade</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-luxury-gold flex-shrink-0" />
                      <span className="text-sm">Frete grátis acima de R$ 500</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-5 w-5 text-luxury-gold flex-shrink-0" />
                      <span className="text-sm">30 dias para troca e devolução</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-16">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-heading font-bold text-luxury-gold mb-6">
                  Detalhes do Produto
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-heading font-semibold mb-4">Especificações</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Categoria:</dt>
                        <dd className="font-medium">{product.category}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Material:</dt>
                        <dd className="font-medium">Ouro 18k</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Origem:</dt>
                        <dd className="font-medium">Brasil</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">SKU:</dt>
                        <dd className="font-medium">{product.id.slice(0, 8)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="font-heading font-semibold mb-4">Cuidados e Manutenção</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Guarde em local seco e protegido da luz</li>
                      <li>• Limpe com flanela macia</li>
                      <li>• Evite contato com produtos químicos</li>
                      <li>• Retire antes de atividades físicas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;