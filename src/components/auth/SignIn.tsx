// Deleza Joias - Sign In Component
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface SignInProps {
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSuccess, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
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

    if (!formData.password) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira sua senha.',
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
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Credenciais inválidas',
            description: 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Erro no login',
            description: error.message,
            variant: 'destructive',
          });
        }
        return;
      }

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo de volta.',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error during sign in:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      toast({
        title: 'Email necessário',
        description: 'Por favor, insira seu email para recuperar a senha.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'Email enviado',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao enviar email de recovery.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-heading text-luxury-gold">
          Entrar na Conta
        </CardTitle>
        <p className="text-muted-foreground">
          Acesse sua conta Deleza Joias
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Sua senha"
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

          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleForgotPassword}
              className="text-luxury-gold hover:text-luxury-gold/80 p-0"
            >
              Esqueci minha senha
            </Button>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Button
              type="button"
              variant="link"
              onClick={onSwitchToSignUp}
              className="text-luxury-gold hover:text-luxury-gold/80 p-0"
            >
              Cadastre-se
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};