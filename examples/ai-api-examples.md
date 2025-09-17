# Exemplos de Uso da API de IA

## 1. Pesquisar Produtos com IA

### Request
```bash
curl -X POST http://localhost:3001/api/v1/ai/produtos/pesquisar \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Quero fazer um bolo de cenoura"
  }'
```

### Response
```json
{
  "success": true,
  "data": {
    "contexto": "Bolo de cenoura",
    "produtos": [
      {
        "item_ia": "cenoura",
        "produto": {
          "id": "507f1f77bcf86cd799439011",
          "nome": "Cenoura orgânica 500g",
          "preco": 5.50,
          "loja_id": "507f1f77bcf86cd799439012",
          "market": {
            "id": "507f1f77bcf86cd799439012",
            "name": "Supermercado Central",
            "address": "Rua das Flores, 123"
          }
        }
      },
      {
        "item_ia": "farinha de trigo",
        "produto": {
          "id": "507f1f77bcf86cd799439013",
          "nome": "Farinha de trigo Dona Benta 1kg",
          "preco": 6.20,
          "loja_id": "507f1f77bcf86cd799439012",
          "market": {
            "id": "507f1f77bcf86cd799439012",
            "name": "Supermercado Central",
            "address": "Rua das Flores, 123"
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

## 2. Preparar Churrasco

### Request
```bash
curl -X POST http://localhost:3001/api/v1/ai/produtos/pesquisar \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Preciso preparar churrasco para 5 pessoas"
  }'
```

## 3. Fazer Salada

### Request
```bash
curl -X POST http://localhost:3001/api/v1/ai/produtos/pesquisar \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Vou fazer uma salada fresca"
  }'
```

## Configuração

### Variáveis de Ambiente
Adicione ao seu arquivo `.env`:
```
OPENAI_API_KEY=sua_chave_da_openai_aqui
```

### Autenticação
Para endpoints que requerem autenticação, inclua o header:
```
Authorization: Bearer SEU_JWT_TOKEN
```

## Fluxo Completo

1. **Usuário digita**: "Quero fazer um bolo de cenoura"
2. **IA processa**: Identifica ingredientes necessários
3. **Sistema busca**: Produtos correspondentes no banco
4. **Resposta**: Lista de produtos disponíveis no marketplace
5. **Log**: Consulta é salva para histórico
