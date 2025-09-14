// Deleza Joias - Sign Up Component
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface SignUpProps {
  onSuccess?: () => void;
  onSwitchToSignIn?: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSuccess, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira seu nome completo.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira seu email.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um email válido.',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: 'Email já cadastrado',
            description: 'Este email já está cadastrado. Faça login ou use outro email.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Erro no cadastro',
            description: error.message,
            variant: 'destructive',
          });
        }
        return;
      }

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Seja bem-vindo à Deleza Joias. Verifique seu email para confirmar sua conta.',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error during sign up:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-heading text-luxury-gold">
          Criar Conta
        </CardTitle>
        <p className="text-muted-foreground">
          Junte-se à família Deleza Joias
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirme sua senha"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              'Criar Conta'
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Button
              type="button"
              variant="link"
              onClick={onSwitchToSignIn}
              className="text-luxury-gold hover:text-luxury-gold/80 p-0"
            >
              Faça login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};