// Deleza Joias - Admin Panel (Scaffold)
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Package, Users, Settings } from 'lucide-react';

const AdminPanel = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h1 className="text-2xl font-heading mb-4">Acesso Negado</h1>
            <p className="text-muted-foreground mb-4">Você não tem permissão para acessar esta área.</p>
            <Button onClick={() => window.location.href = '/'}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-heading font-bold text-luxury-gold">Painel Administrativo</h1>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar à Loja
            </Button>
          </div>
          <p className="text-muted-foreground">Bem-vindo, {user.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-luxury-gold" />
                Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Gerenciar catálogo de produtos</p>
              <Button 
                className="w-full bg-luxury-gold text-luxury-black"
                onClick={() => toast({ title: 'Em Desenvolvimento', description: 'CRUD de produtos será implementado.' })}
              >
                Gerenciar Produtos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-luxury-gold" />
                Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Gerenciar usuários do sistema</p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => toast({ title: 'Em Desenvolvimento', description: 'Gerenciamento de usuários será implementado.' })}
              >
                Ver Usuários
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-luxury-gold" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Configurações do sistema</p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => toast({ title: 'Em Desenvolvimento', description: 'Configurações serão implementadas.' })}
              >
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;