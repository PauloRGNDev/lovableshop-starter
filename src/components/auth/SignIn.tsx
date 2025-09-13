// Deleza Joias - Sign In Component
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return 'E-mail é obrigatório.';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'E-mail inválido.';
    }
    
    if (!formData.password) {
      return 'Senha é obrigatória.';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: 'Erro de Validação',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Conta não encontrada. Cadastre-se primeiro.');
        }
        throw error;
      }

      if (data.user) {
        toast({
          title: 'Login realizado!',
          description: 'Bem-vindo de volta à Deleza Joias.',
        });
        
        onSuccess?.();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: 'Erro no Login',
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      toast({
        title: 'E-mail Necessário',
        description: 'Digite seu e-mail para recuperar a senha.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email);
      
      if (error) throw error;

      toast({
        title: 'E-mail Enviado',
        description: 'Verifique sua caixa de entrada para redefinir a senha.',
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o e-mail de recuperação.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-luxury">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-heading text-luxury-gold">
          Entrar
        </CardTitle>
        <CardDescription>
          Acesse sua conta Deleza Joias
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Sua senha"
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Button
              type="button"
              variant="link"
              onClick={handleForgotPassword}
              className="p-0 h-auto text-sm text-muted-foreground hover:text-luxury-gold"
              disabled={isLoading}
            >
              Esqueceu a senha?
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90"
            disabled={isLoading}
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

          {/* Switch to Sign Up */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToSignUp}
                className="p-0 h-auto text-luxury-gold hover:text-luxury-gold/80"
              >
                Cadastre-se
              </Button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};