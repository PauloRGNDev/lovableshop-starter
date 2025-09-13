# Deleza Joias - E-commerce

Projeto completo de e-commerce para joias artesanais desenvolvido com Next.js, TypeScript, Supabase e Stripe.

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js (versão 16 ou superior)
- Conta no Supabase
- Conta no Stripe

### Passos de instalação

1. **Clone o repositório**
```bash
git clone <YOUR_GIT_URL>
cd deleza-joias
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e configure as seguintes variáveis:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_stripe_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_stripe_aqui

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Configure o banco de dados**
- Execute o script SQL em `db/init.sql` no seu painel Supabase
- Isso criará todas as tabelas necessárias e dados de exemplo

5. **Execute o projeto**
```bash
npm run dev
```

6. **Verificar build**
```bash
npm run build
```

## 🛠 Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Pagamentos**: Stripe
- **Autenticação**: Supabase Auth
- **UI**: shadcn/ui, Radix UI

## 📱 Funcionalidades

### Implementadas
- ✅ Design system completo com tema luxury gold
- ✅ Catálogo de produtos com filtros e busca
- ✅ Carrinho de compras funcional (Context API)
- ✅ Sistema de autenticação (cadastro/login)
- ✅ Scaffold do painel administrativo
- ✅ Integração Stripe preparada
- ✅ Páginas de teste e verificação

### Em desenvolvimento
- 🔄 CRUD completo de produtos (admin)
- 🔄 Checkout completo com Stripe
- 🔄 Gestão de pedidos
- 🔄 Upload de imagens
- 🔄 Sistema de wishlist

## 🔍 Páginas especiais

- `/dev-check` - Verificação do status de configuração
- `/test-cart` - Teste das funcionalidades do carrinho
- `/admin` - Painel administrativo (requer permissão)

## 🎨 Design System

O projeto utiliza um design system completo baseado no tema luxury com:
- Paleta dourada elegante
- Tipografia Playfair Display + Inter
- Componentes shadcn/ui customizados
- Animações suaves e transições

## 🔐 Segurança

- Row Level Security (RLS) configurado no Supabase
- Autenticação JWT via Supabase Auth
- Validação de permissões admin
- Sanitização de dados

## 📦 Estrutura do projeto

```
src/
├── components/         # Componentes reutilizáveis
├── contexts/          # React Contexts (CartContext)
├── hooks/            # Custom hooks (useAuth)
├── lib/              # Utilitários e configurações
├── pages/            # Páginas Next.js
├── types/            # TypeScript type definitions
└── data/             # Dados mock e constantes

db/
└── init.sql          # Script de inicialização do banco

.env.example          # Template das variáveis de ambiente
```

## 🚀 Deploy

1. Configure as variáveis de ambiente no seu provedor
2. Execute `npm run build` para verificar builds
3. Deploy para Vercel, Netlify ou similar
4. Configure domínio customizado (opcional)

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique a página `/dev-check` para status das configurações
- Consulte logs do console para erros
- Teste funcionalidades em `/test-cart`

---

**Deleza Joias** - Elegância que Encanta ✨