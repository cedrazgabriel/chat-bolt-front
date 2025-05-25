# 🔐 Sistema de Autenticação - Chat Bolt

## 📋 Visão Geral

Este projeto implementa um sistema completo de autenticação usando:

- **React Context API** + **useReducer** para gerenciamento de estado
- **React Query** para cache e sincronização de dados
- **Cookies HTTP-only** para segurança máxima
- **React Router** para roteamento protegido
- **TypeScript** para type safety

## 🚀 Configuração

### 1. Configuração da API

Você tem duas opções para configurar a URL da sua API:

**Opção 1: Arquivo .env (Recomendado)**
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

**Opção 2: Configuração direta**
Edite o arquivo `src/config/env.ts` e altere a URL padrão:

```typescript
export const config = {
  API_URL: 'http://localhost:3000/api', // Altere aqui
  // ...
};
```

### 2. Estrutura da API (Backend)

Sua API deve implementar os seguintes endpoints:

#### POST `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Resposta:**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "João Silva",
    "avatar": "https://example.com/avatar.jpg"
  },
  "token": "jwt_token_here",
  "message": "Login realizado com sucesso"
}
```

#### POST `/auth/register`
```json
{
  "name": "João Silva",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### GET `/auth/me`
Retorna os dados do usuário autenticado (requer cookie de autenticação)

#### POST `/auth/logout`
Invalida o cookie de autenticação

#### POST `/auth/refresh`
Renova o token de autenticação

### 3. Configuração de Cookies

Sua API deve configurar cookies HTTP-only:

```javascript
// Exemplo em Node.js/Express
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
});
```

## 🎯 Como Usar

### Hook de Autenticação

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    register 
  } = useAuth();

  // Fazer login
  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' });
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  // Fazer logout
  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Olá, {user?.name}!</p>
      ) : (
        <button onClick={handleLogin}>Entrar</button>
      )}
    </div>
  );
}
```

### Rotas Protegidas

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

## 🔒 Segurança

### Cookies HTTP-only
- ✅ Não acessíveis via JavaScript
- ✅ Proteção contra XSS
- ✅ Enviados automaticamente nas requisições

### Validação Automática
- ✅ Verifica autenticação ao carregar a página
- ✅ Redireciona automaticamente se não autenticado
- ✅ Cache inteligente com React Query

### Type Safety
- ✅ Tipos TypeScript para todas as interfaces
- ✅ Validação em tempo de compilação
- ✅ IntelliSense completo

## 📁 Estrutura de Arquivos

```
src/
├── types/
│   └── auth.ts              # Tipos TypeScript
├── services/
│   └── api.ts               # Serviço de API
├── contexts/
│   └── AuthContext.tsx      # Context de autenticação
├── components/
│   └── ProtectedRoute.tsx   # Componente de rota protegida
├── pages/
│   ├── LoginPage.tsx        # Página de login
│   └── HomePage.tsx         # Página inicial
└── App.tsx                  # Configuração principal
```

## 🎨 Customização

### Temas e Estilos
O sistema usa Tailwind CSS e é totalmente customizável. Você pode:

- Alterar cores no `LoginPage.tsx`
- Modificar layouts no `HomePage.tsx`
- Adicionar novos componentes de UI

### Funcionalidades Adicionais
Você pode facilmente adicionar:

- Página de registro
- Recuperação de senha
- Perfil do usuário
- Configurações de conta

## 🚀 Próximos Passos

1. Configure sua API backend
2. Teste o fluxo de autenticação
3. Customize a interface
4. Adicione funcionalidades específicas do seu projeto

## 💡 Dicas

- Use `credentials: 'include'` em todas as requisições
- Configure CORS corretamente no backend
- Implemente refresh token para sessões longas
- Adicione loading states para melhor UX 