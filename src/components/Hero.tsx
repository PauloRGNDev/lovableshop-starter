// Deleza Joias - Hero Section Component
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onShopNow?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-gold">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-luxury-black mr-2" />
              <span className="text-sm uppercase tracking-wider text-luxury-black font-medium">
                Coleção Exclusiva
              </span>
              <Sparkles className="h-6 w-6 text-luxury-black ml-2" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-luxury-black mb-6">
              Elegância que
              <br />
              <span className="text-luxury-white">Encanta</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-luxury-black/80 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Descubra nossa coleção única de joias artesanais, 
            criadas com paixão e dedicação para momentos especiais.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button
              size="lg"
              onClick={onShopNow}
              className="bg-luxury-black text-luxury-white hover:bg-luxury-black/90 shadow-luxury px-8 py-6 text-lg font-medium group"
            >
              Ver Coleção
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-luxury-white px-8 py-6 text-lg"
            >
              Sobre Nós
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-luxury-black/20 animate-fade-in">
            <div>
              <div className="text-3xl font-heading font-bold text-luxury-black">500+</div>
              <div className="text-sm text-luxury-black/70 uppercase tracking-wider">
                Clientes Satisfeitos
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-luxury-black">15+</div>
              <div className="text-sm text-luxury-black/70 uppercase tracking-wider">
                Anos de Experiência
              </div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-luxury-black">100%</div>
              <div className="text-sm text-luxury-black/70 uppercase tracking-wider">
                Artesanal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-luxury-black/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-luxury-black/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};