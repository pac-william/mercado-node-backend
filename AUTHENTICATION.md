# Sistema de Autenticação - Marketplace

## Visão Geral

O sistema de autenticação implementado suporta dois tipos de usuários:

1. **Usuário Final (CUSTOMER)** - Cliente que compra produtos
2. **Mercado/Lojista (ADMIN)** - Estabelecimento que cadastra produtos e gerencia pedidos

## Funcionalidades

### 🔐 Autenticação
- **Registro de usuários** e **mercados**
- **Login unificado** (usuário ou mercado)
- **Tokens JWT** com refresh tokens
- **Cookies HTTP-only** para segurança
- **Hash de senhas** com bcrypt

### 🛡️ Autorização
- **Middleware de autenticação** obrigatória
- **Middleware de autorização** baseada em roles
- **Autenticação opcional** para personalização de conteúdo
- **Controle de acesso** granular por endpoint

## Endpoints de Autenticação

### Registro
```bash
# Registrar usuário
POST /api/v1/auth/register/user
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}

# Registrar mercado
POST /api/v1/auth/register/market
{
  "name": "Supermercado ABC",
  "address": "Rua das Flores, 123",
  "email": "contato@supermercadoabc.com",
  "password": "senha123",
  "profilePicture": "https://example.com/logo.jpg" // opcional
}
```

### Login
```bash
POST /api/v1/auth/login
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "role": "CUSTOMER", // ou "ADMIN"
  "id": "user_id_here",
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### Renovação de Token
```bash
POST /api/v1/auth/refresh-token
{
  "refreshToken": "refresh_token_here"
}
```

### Logout
```bash
POST /api/v1/auth/logout
```

## Middleware de Autenticação

### 1. Autenticação Obrigatória
```typescript
import { authenticate } from '../middleware/auth';

router.post('/protected-route', authenticate, controller.method);
```

### 2. Autorização por Role
```typescript
import { requireMarketOrAdmin, requireCustomer } from '../middleware/auth';

// Apenas mercados podem acessar
router.post('/admin-only', authenticate, requireMarketOrAdmin, controller.method);

// Apenas usuários finais podem acessar
router.get('/customer-only', authenticate, requireCustomer, controller.method);
```

### 3. Autenticação Opcional
```typescript
import { optionalAuth } from '../middleware/auth';

// Funciona com ou sem autenticação
router.get('/public-with-personalization', optionalAuth, controller.method);
```

## Estrutura de Rotas Protegidas

### Rotas Públicas (com autenticação opcional)
- `GET /api/v1/products` - Listar produtos
- `GET /api/v1/markets` - Listar mercados
- `GET /api/v1/categories` - Listar categorias
- `GET /api/v1/deliverers` - Listar entregadores
- `GET /api/v1/orders` - Listar pedidos

### Rotas Protegidas (apenas mercados)
- `POST /api/v1/products` - Criar produto
- `PUT /api/v1/products/:id` - Atualizar produto
- `DELETE /api/v1/products/:id` - Deletar produto
- `POST /api/v1/deliverers` - Criar entregador
- `POST /api/v1/orders` - Criar pedido
- `POST /api/v1/orders/:id/assign-deliverer` - Atribuir entregador

## Configuração

### Variáveis de Ambiente
```bash
# JWT Secrets
JWT_SECRET="supersecretjwtkey"
JWT_REFRESH_SECRET="supersecretrefreshkey"

# Frontend URL (para CORS)
FRONTEND_URL="http://localhost:3000"

# Server
PORT=8080
NODE_ENV="development"
```

### Cookies HTTP-Only
Os tokens são automaticamente configurados como cookies HTTP-only para maior segurança:
- `accessToken` - Expira em 15 minutos
- `refreshToken` - Expira em 7 dias

## Exemplo de Uso no Frontend

### Login
```javascript
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Importante para cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// Tokens são automaticamente salvos como cookies
```

### Requisições Autenticadas
```javascript
const response = await fetch('/api/v1/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}` // Opcional se usando cookies
  },
  credentials: 'include',
  body: JSON.stringify(productData)
});
```

## Segurança

### ✅ Implementado
- Hash de senhas com bcrypt
- Tokens JWT com expiração
- Refresh tokens para renovação
- Cookies HTTP-only
- CORS configurado
- Validação de dados com Zod
- Logs de segurança

### 🔒 Boas Práticas
- Use HTTPS em produção
- Configure secrets seguros
- Implemente rate limiting
- Monitore tentativas de login
- Use CSP headers
- Valide todos os inputs

## Troubleshooting

### Erro 401 - Não autorizado
- Verifique se o token está sendo enviado
- Confirme se o token não expirou
- Use o refresh token para renovar

### Erro 403 - Acesso negado
- Verifique se o usuário tem a role correta
- Confirme se está usando o middleware de autorização adequado

### Cookies não funcionam
- Verifique se `credentials: 'include'` está configurado
- Confirme se o CORS está permitindo credentials
- Verifique se o domínio está correto
