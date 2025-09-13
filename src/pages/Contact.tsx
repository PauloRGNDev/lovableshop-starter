// Deleza Joias - Contact Page
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Mensagem Enviada!',
        description: 'Entraremos em contato em breve. Obrigado!',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contato - Deleza Joias | Fale Conosco</title>
        <meta 
          name="description" 
          content="Entre em contato com a Deleza Joias. Tire suas dúvidas, solicite orçamentos ou agende uma visita. Estamos aqui para ajudar você a encontrar a joia perfeita." 
        />
        <meta property="og:title" content="Contato - Deleza Joias | Fale Conosco" />
        <meta property="og:description" content="Entre em contato com a Deleza Joias. Tire suas dúvidas, solicite orçamentos ou agende uma visita." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/contact`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-elegant">
          <div className="container mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-luxury-gold text-luxury-black">
              <MessageCircle className="h-4 w-4 mr-2" />
              Fale Conosco
            </Badge>
            <h1 className="text-5xl font-heading font-bold text-white mb-6">
              Estamos Aqui para Você
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Tem alguma dúvida? Precisa de ajuda para escolher a joia perfeita? 
              Nossa equipe está pronta para atender você com toda atenção que merece.
            </p>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-luxury">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading text-luxury-gold">
                    Envie sua Mensagem
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Preencha o formulário abaixo e retornaremos o mais breve possível.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="(11) 9999-9999"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto *</Label>
                        <Input
                          id="subject"
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          placeholder="Assunto da sua mensagem"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Conte-nos como podemos ajudar você..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-luxury-black mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-heading text-luxury-gold">
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-luxury-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Endereço</p>
                      <p className="text-sm text-muted-foreground">
                        Rua Augusta, 2500<br />
                        Jardins - São Paulo, SP<br />
                        CEP: 01310-300
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-luxury-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-sm text-muted-foreground">
                        (11) 9999-9999<br />
                        (11) 3333-3333
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-luxury-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">E-mail</p>
                      <p className="text-sm text-muted-foreground">
                        contato@delezajoias.com<br />
                        vendas@delezajoias.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-luxury-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Horário de Funcionamento</p>
                      <p className="text-sm text-muted-foreground">
                        Segunda a Sexta: 9h às 18h<br />
                        Sábados: 9h às 16h<br />
                        Domingos: Fechado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-heading text-luxury-gold">
                    Perguntas Frequentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start p-0 h-auto text-left">
                      <div className="text-sm">
                        <p className="font-medium">Como cuidar das minhas joias?</p>
                        <p className="text-muted-foreground">Dicas de conservação e limpeza</p>
                      </div>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start p-0 h-auto text-left">
                      <div className="text-sm">
                        <p className="font-medium">Certificado de autenticidade</p>
                        <p className="text-muted-foreground">Todas as peças são certificadas</p>
                      </div>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start p-0 h-auto text-left">
                      <div className="text-sm">
                        <p className="font-medium">Política de troca e devolução</p>
                        <p className="text-muted-foreground">Conheça nossos prazos</p>
                      </div>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start p-0 h-auto text-left">
                      <div className="text-sm">
                        <p className="font-medium">Encomendas personalizadas</p>
                        <p className="text-muted-foreground">Criamos peças exclusivas</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-luxury-gold text-luxury-black">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Phone className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="font-heading font-semibold mb-2">
                      Atendimento Urgente
                    </h3>
                    <p className="text-sm mb-3">
                      Para emergências ou dúvidas urgentes
                    </p>
                    <Button variant="secondary" className="w-full">
                      (11) 9 9999-9999
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-bold text-luxury-gold mb-4">
                Nossa Localização
              </h2>
              <p className="text-muted-foreground">
                Visite nossa loja no coração dos Jardins, em São Paulo
              </p>
            </div>
            
            <Card className="overflow-hidden">
              <div className="h-96 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-luxury-gold mx-auto mb-4" />
                  <p className="text-lg font-medium">Mapa Interativo</p>
                  <p className="text-sm text-muted-foreground">
                    Rua Augusta, 2500 - Jardins, São Paulo
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;