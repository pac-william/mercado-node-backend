# Módulo de Pesquisa de Produtos com IA

## 🚀 Funcionalidades Implementadas

### ✅ **API de Pesquisa com IA**
- **Endpoint**: `POST /api/v1/ai/produtos/pesquisar`
- **Funcionalidade**: Recebe texto em linguagem natural e retorna produtos correspondentes
- **Integração**: OpenAI GPT-4o (com fallback para respostas pré-definidas)

### ✅ **Busca Semântica de Produtos**
- Busca exata por nome
- Busca por similaridade (LIKE)
- Busca por palavras-chave
- Normalização de nomes de ingredientes

### ✅ **Histórico de Buscas**
- **Endpoint**: `GET /api/v1/ai/buscas`
- **Funcionalidade**: Lista histórico de consultas do usuário
- **Log**: Todas as consultas são salvas no banco de dados

### ✅ **Produtos Similares**
- **Endpoint**: `GET /api/v1/ai/produtos/similares/:productId`
- **Funcionalidade**: Encontra produtos similares baseado em categoria e nome

### ✅ **Produtos por Categoria**
- **Endpoint**: `GET /api/v1/ai/produtos/categoria/:categoryName`
- **Funcionalidade**: Lista produtos de uma categoria específica

## 🏗️ **Arquitetura Implementada**

### **1. Schema do Banco de Dados**
```prisma
model AiSearch {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String?  @db.ObjectId
  user        User?    @relation(fields: [userId], references: [id])
  prompt      String
  aiResponse  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### **2. Serviços Criados**
- **`AiService`**: Comunicação com OpenAI GPT-4o
- **`ProductSearchService`**: Busca semântica de produtos
- **`AiRepository`**: Persistência de logs de consultas

### **3. Controladores**
- **`AiController`**: Endpoints da API de IA
- Tratamento de erros robusto
- Logs detalhados de operações

### **4. Documentação Swagger**
- Documentação completa da API
- Exemplos de request/response
- Esquemas de validação

## 🔧 **Configuração**

### **1. Variáveis de Ambiente**
```bash
# Adicione ao arquivo .env
OPENAI_API_KEY=sua_chave_da_openai_aqui
```

### **2. Instalação de Dependências**
```bash
npm install openai --legacy-peer-deps
```

### **3. Geração do Cliente Prisma**
```bash
npx prisma generate
```

## 📝 **Exemplos de Uso**

### **1. Pesquisar Produtos para Bolo de Cenoura**
```bash
curl -X POST http://localhost:3001/api/v1/ai/produtos/pesquisar \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Quero fazer um bolo de cenoura"}'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "contexto": "Bolo de cenoura",
    "produtos": [
      {
        "item_ia": "cenoura",
        "produto": {
          "id": "68bc8d8dcbfcf7119193f30e",
          "nome": "Cenoura",
          "preco": 3.99,
          "loja_id": "68bbe5267089b8c98b5d8d28",
          "market": {
            "id": "68bbe5267089b8c98b5d8d28",
            "name": "Supermercado Central",
            "address": "Rua das Flores, 123, Centro"
          }
        }
      },
      {
        "item_ia": "fermento em pó",
        "status": "não encontrado"
      }
    ]
  }
}
```

### **2. Preparar Churrasco**
```bash
curl -X POST http://localhost:3001/api/v1/ai/produtos/pesquisar \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Preciso preparar churrasco para 5 pessoas"}'
```

### **3. Histórico de Buscas**
```bash
curl -X GET http://localhost:3001/api/v1/ai/buscas?page=1&size=10
```

## 🎯 **Fluxo de Funcionamento**

1. **Usuário envia prompt**: "Quero fazer um bolo de cenoura"
2. **IA processa**: Identifica ingredientes necessários
3. **Sistema busca**: Produtos correspondentes no banco de dados
4. **Resposta**: Lista de produtos disponíveis no marketplace
5. **Log**: Consulta é salva para histórico

## 🔍 **Algoritmo de Busca**

### **1. Busca Exata**
- Procura por nome exato do produto

### **2. Busca por Similaridade**
- Usa LIKE para encontrar produtos similares

### **3. Busca por Palavras-chave**
- Divide o nome em palavras e busca cada uma

### **4. Normalização**
- Remove caracteres especiais
- Converte para minúsculas
- Normaliza espaços

## 🛡️ **Tratamento de Erros**

- **400**: Prompt inválido ou vazio
- **401**: Usuário não autenticado
- **503**: Serviço de IA indisponível
- **500**: Erro interno do servidor

## 📊 **Logs e Monitoramento**

- Todas as consultas são logadas
- Histórico por usuário
- Métricas de uso da IA
- Tratamento de erros detalhado

## 🚀 **Próximos Passos**

1. **Implementar autenticação JWT**
2. **Adicionar cache para consultas frequentes**
3. **Implementar busca por geolocalização**
4. **Adicionar suporte a imagens de produtos**
5. **Implementar recomendações personalizadas**

## 📚 **Documentação da API**

Acesse a documentação completa em:
```
http://localhost:3001/api-docs
```

## 🧪 **Testes**

Para testar a API, use os exemplos fornecidos ou acesse a documentação Swagger para testar interativamente.

---

**✅ Módulo de IA totalmente implementado e funcionando!**
