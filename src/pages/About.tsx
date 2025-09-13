// Deleza Joias - About Page
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Award, Gem, Users, Clock, Shield } from 'lucide-react';

const About = () => {
  return (
    <>
      <Helmet>
        <title>Sobre - Deleza Joias | Nossa História e Valores</title>
        <meta 
          name="description" 
          content="Conheça a história da Deleza Joias, nossa missão de criar joias únicas e atemporais, e os valores que nos guiam desde 1985. Tradição e elegância em cada peça." 
        />
        <meta property="og:title" content="Sobre - Deleza Joias | Nossa História e Valores" />
        <meta property="og:description" content="Conheça a história da Deleza Joias, nossa missão de criar joias únicas e atemporais, e os valores que nos guiam desde 1985." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/about`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Deleza Joias",
            "description": "Joias finas e exclusivas com tradição familiar desde 1985",
            "url": window.location.origin,
            "foundingDate": "1985",
            "founder": {
              "@type": "Person",
              "name": "Elena Deleza"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "São Paulo",
              "addressRegion": "SP",
              "addressCountry": "BR"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+55-11-9999-9999",
              "contactType": "customer service",
              "email": "contato@delezajoias.com"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-elegant">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <Badge className="mb-4 bg-luxury-gold text-luxury-black">
              Tradição desde 1985
            </Badge>
            <h1 className="text-5xl font-heading font-bold text-white mb-6">
              Nossa História
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Há quatro décadas criando joias que eternizam os momentos mais preciosos da vida.
              Cada peça carrega nossa paixão pela excelência e o compromisso com a beleza atemporal.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Heart className="h-4 w-4 mr-2" />
                  Nossa Missão
                </Badge>
                <h2 className="text-3xl font-heading font-bold text-luxury-gold mb-6">
                  Transformar Momentos em Memórias Eternas
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Na Deleza Joias, acreditamos que cada joia conta uma história única. Nossa missão é 
                  criar peças excepcionais que celebrem os momentos mais importantes da sua vida, 
                  desde o primeiro "sim" até as conquistas que merecem ser eternizadas.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Combinamos tradição artesanal com design contemporâneo, utilizando apenas os 
                  materiais mais nobres para garantir que cada peça seja verdadeiramente especial.
                </p>
              </div>
              
              <Card className="shadow-luxury">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                      <Gem className="h-10 w-10 text-luxury-black" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-4">
                      Excelência em Cada Detalhe
                    </h3>
                    <p className="text-muted-foreground">
                      Desde a seleção das pedras preciosas até o acabamento final, 
                      cada etapa é executada com maestria e dedicação.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Clock className="h-4 w-4 mr-2" />
                Nossa Trajetória
              </Badge>
              <h2 className="text-3xl font-heading font-bold text-luxury-gold">
                Décadas de Tradição e Inovação
              </h2>
            </div>

            <div className="space-y-12">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-luxury-gold p-8 text-luxury-black">
                      <div className="text-4xl font-bold font-heading mb-2">1985</div>
                      <div className="text-lg font-semibold">O Início</div>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <p className="text-lg leading-relaxed">
                        Elena Deleza funda a empresa com o sonho de criar joias que celebrassem 
                        o amor e a beleza. Com apenas algumas ferramentas e muito talento, 
                        começou a atender clientes em um pequeno ateliê no centro de São Paulo.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-luxury-black p-8 text-white order-2 md:order-1">
                      <div className="text-4xl font-bold font-heading mb-2">2000</div>
                      <div className="text-lg font-semibold">Expansão</div>
                    </div>
                    <div className="md:w-2/3 p-8 order-1 md:order-2">
                      <p className="text-lg leading-relaxed">
                        A segunda geração assume os negócios, trazendo inovação tecnológica 
                        sem perder a essência artesanal. Inauguramos nossa primeira loja 
                        física e expandimos para o mercado nacional.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-luxury-gold p-8 text-luxury-black">
                      <div className="text-4xl font-bold font-heading mb-2">Hoje</div>
                      <div className="text-lg font-semibold">Futuro</div>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <p className="text-lg leading-relaxed">
                        Com quase 40 anos de experiência, a Deleza Joias continua a inovar, 
                        agora também no mundo digital, mantendo o compromisso com a qualidade 
                        e o atendimento personalizado que nos tornaram referência.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Award className="h-4 w-4 mr-2" />
                Nossos Valores
              </Badge>
              <h2 className="text-3xl font-heading font-bold text-luxury-gold mb-4">
                O que nos Move
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Valores sólidos que orientam cada decisão e garantem a excelência 
                em tudo que fazemos.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <Gem className="h-8 w-8 text-luxury-black" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-4">Qualidade</h3>
                  <p className="text-muted-foreground">
                    Utilizamos apenas os melhores materiais e técnicas refinadas 
                    para garantir peças de qualidade excepcional.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-luxury-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-4">Relacionamento</h3>
                  <p className="text-muted-foreground">
                    Construímos relacionamentos duradouros baseados na confiança, 
                    transparência e atendimento personalizado.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-luxury transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-luxury-black" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-4">Confiança</h3>
                  <p className="text-muted-foreground">
                    Cada peça vem com certificado de autenticidade e garantia, 
                    assegurando sua tranquilidade e satisfação.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-luxury-black text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-heading font-bold mb-6">
              Faça Parte da Nossa História
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Descubra nossa coleção e encontre a joia perfeita para o seu momento especial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90">
                Ver Catálogo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-luxury-black">
                Fale Conosco
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;