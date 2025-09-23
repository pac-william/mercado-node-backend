export const orderPaths = {
    "/api/v1/orders": {
        "get": {
            "tags": ["Orders"],
            "summary": "Listar pedidos",
            "description": "Retorna uma lista paginada de pedidos com filtros opcionais.",
            "parameters": [
                {
                    "name": "page",
                    "in": "query",
                    "description": "Número da página",
                    "required": false,
                    "schema": { "type": "integer", "default": 1 }
                },
                {
                    "name": "size",
                    "in": "query",
                    "description": "Tamanho da página",
                    "required": false,
                    "schema": { "type": "integer", "default": 10 }
                },
                {
                    "name": "status",
                    "in": "query",
                    "description": "Status do pedido",
                    "required": false,
                    "schema": { 
                        "type": "string", 
                        "enum": ["PENDING", "CONFIRMED", "PREPARING", "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] 
                    }
                },
                {
                    "name": "userId",
                    "in": "query",
                    "description": "ID do usuário",
                    "required": false,
                    "schema": { "type": "string" }
                },
                {
                    "name": "marketId",
                    "in": "query",
                    "description": "ID do mercado",
                    "required": false,
                    "schema": { "type": "string" }
                },
                {
                    "name": "delivererId",
                    "in": "query",
                    "description": "ID do entregador",
                    "required": false,
                    "schema": { "type": "string" }
                }
            ],
            "responses": {
                "200": {
                    "description": "Lista de pedidos retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/OrderPaginatedResponse" }
                        }
                    }
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        },
        "post": {
            "tags": ["Orders"],
            "summary": "Criar pedido",
            "description": "Cria um novo pedido no sistema.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/OrderDTO" }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Pedido criado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Order" }
                        }
                    }
                },
                "400": {
                    "description": "Erro de validação"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/orders/{id}": {
        "get": {
            "tags": ["Orders"],
            "summary": "Buscar pedido por ID",
            "description": "Retorna um pedido específico pelo ID.",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" }
                }
            ],
            "responses": {
                "200": {
                    "description": "Pedido retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Order" }
                        }
                    }
                },
                "404": {
                    "description": "Pedido não encontrado"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        },
        "put": {
            "tags": ["Orders"],
            "summary": "Atualizar pedido",
            "description": "Atualiza um pedido existente.",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" }
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/OrderUpdateDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Pedido atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Order" }
                        }
                    }
                },
                "400": {
                    "description": "Erro de validação"
                },
                "404": {
                    "description": "Pedido não encontrado"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/orders/{id}/assign-deliverer": {
        "post": {
            "tags": ["Orders"],
            "summary": "Atribuir entregador ao pedido",
            "description": "Atribui um entregador a um pedido específico.",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" }
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/AssignDelivererDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Entregador atribuído com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Order" }
                        }
                    }
                },
                "400": {
                    "description": "Erro de validação"
                },
                "404": {
                    "description": "Pedido ou entregador não encontrado"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    }
};

export const orderSchemas = {
    "Order": {
        "type": "object",
        "properties": {
            "id": { "type": "string", "example": "507f1f77bcf86cd799439011" },
            "userId": { "type": "string", "example": "507f1f77bcf86cd799439012" },
            "marketId": { "type": "string", "example": "507f1f77bcf86cd799439013" },
            "delivererId": { "type": "string", "example": "507f1f77bcf86cd799439014" },
            "status": { 
                "type": "string", 
                "enum": ["PENDING", "CONFIRMED", "PREPARING", "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
                "example": "PENDING" 
            },
            "total": { "type": "number", "format": "float", "example": 45.99 },
            "deliveryAddress": { "type": "string", "example": "Rua das Flores, 123" },
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": { "type": "string" },
                        "productId": { "type": "string" },
                        "quantity": { "type": "integer" },
                        "price": { "type": "number" }
                    }
                }
            },
            "createdAt": { "type": "string", "format": "date-time" },
            "updatedAt": { "type": "string", "format": "date-time" }
        }
    },
    "OrderDTO": {
        "type": "object",
        "properties": {
            "userId": { "type": "string", "example": "507f1f77bcf86cd799439012" },
            "marketId": { "type": "string", "example": "507f1f77bcf86cd799439013" },
            "deliveryAddress": { "type": "string", "example": "Rua das Flores, 123" },
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "productId": { "type": "string" },
                        "quantity": { "type": "integer", "minimum": 1 },
                        "price": { "type": "number", "minimum": 0 }
                    },
                    "required": ["productId", "quantity", "price"]
                }
            }
        },
        "required": ["userId", "marketId", "deliveryAddress", "items"]
    },
    "OrderUpdateDTO": {
        "type": "object",
        "properties": {
            "status": { 
                "type": "string", 
                "enum": ["PENDING", "CONFIRMED", "PREPARING", "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] 
            },
            "delivererId": { "type": "string" }
        }
    },
    "AssignDelivererDTO": {
        "type": "object",
        "properties": {
            "delivererId": { "type": "string", "example": "507f1f77bcf86cd799439014" }
        },
        "required": ["delivererId"]
    },
    "OrderPaginatedResponse": {
        "type": "object",
        "properties": {
            "orders": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/Order" }
            },
            "meta": { "$ref": "#/components/schemas/Meta" }
        }
    }
};

export const orderTags = [
    {
        "name": "Orders",
        "description": "Operações relacionadas a pedidos"
    }
];
