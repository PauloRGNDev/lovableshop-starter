// Deleza Joias - Development Check Page
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CheckResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
}

const DevCheck = () => {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    runChecks();
  }, []);

  const runChecks = async () => {
    setIsLoading(true);
    const results: CheckResult[] = [];

    // Check environment variables
    const envVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLIC_KEY',
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_BASE_URL'
    ];

    envVars.forEach(envVar => {
      const value = process.env[envVar];
      results.push({
        name: `${envVar}`,
        status: value && value !== 'COLOQUE_AQUI' ? 'success' : 'error',
        message: value && value !== 'COLOQUE_AQUI' 
          ? 'Configurado' 
          : 'Não configurado - adicione no .env.local'
      });
    });

    // Since this is now using the integrated Supabase client,
    // we can simplify by testing the connection directly
    try {
      const { error } = await supabase.auth.getSession();
      results.push({
        name: 'Conexão Supabase',
        status: error ? 'error' : 'success',
        message: error ? `Erro: ${error.message}` : 'Conectado com sucesso'
      });
    } catch (error) {
      results.push({
        name: 'Conexão Supabase',
        status: 'error',
        message: `Erro de conexão: ${error}`
      });
    }

    // Check required tables - since no tables exist yet, we'll show they need to be created
    const tables = ['profiles', 'products', 'orders', 'order_items', 'shopping_cart'];
    
    for (const table of tables) {
      results.push({
        name: `Tabela: ${table}`,
        status: 'warning',
        message: 'Tabela precisa ser criada via migração'
      });
    }

    setChecks(results);
    setIsLoading(false);
  };

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: CheckResult['status']) => {
    const variants = {
      success: 'default' as const,
      error: 'destructive' as const,
      warning: 'secondary' as const,
    };

    const labels = {
      success: 'OK',
      error: 'Erro',
      warning: 'Aviso',
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" onClick={() => window.location.href = '/'} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar à Loja
          </Button>
          
          <h1 className="text-3xl font-heading font-bold text-luxury-gold mb-2">
            Verificação de Desenvolvimento
          </h1>
          <p className="text-muted-foreground">
            Status das configurações e conexões do sistema.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Status do Sistema</CardTitle>
            <Button 
              onClick={runChecks} 
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? 'Verificando...' : 'Atualizar'}
            </Button>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mx-auto mb-4"></div>
                <p>Executando verificações...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {checks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <div className="font-medium">{check.name}</div>
                        <div className="text-sm text-muted-foreground">{check.message}</div>
                      </div>
                    </div>
                    {getStatusBadge(check.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Configure as variáveis de ambiente no arquivo .env.local</p>
            <p>2. Execute o script SQL db/init.sql no seu banco Supabase</p>
            <p>3. Configure as chaves do Stripe para pagamentos</p>
            <p>4. Teste as funcionalidades em /test-cart</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevCheck;