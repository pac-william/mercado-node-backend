export const cartPaths = {
    "/api/v1/cart": {
        "get": {
            "tags": ["Cart"],
            "summary": "Buscar carrinho do usuário",
            "description": "Retorna o carrinho do usuário autenticado. Se não existir, cria um novo carrinho vazio.",
            "security": [{ "bearerAuth": [] }],
            "responses": {
                "200": {
                    "description": "Carrinho retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/CartResponse" }
                        }
                    }
                },
                "401": {
                    "description": "Usuário não autenticado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não autenticado" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Erro interno do servidor",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Erro interno do servidor" }
                                }
                            }
                        }
                    }
                }
            }
        },
        "delete": {
            "tags": ["Cart"],
            "summary": "Limpar carrinho",
            "description": "Remove todos os itens do carrinho do usuário autenticado.",
            "security": [{ "bearerAuth": [] }],
            "responses": {
                "204": {
                    "description": "Carrinho limpo com sucesso"
                },
                "401": {
                    "description": "Usuário não autenticado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não autenticado" }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Carrinho não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Carrinho não encontrado" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Erro interno do servidor",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Erro interno do servidor" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/api/v1/cart/items": {
        "post": {
            "tags": ["Cart"],
            "summary": "Adicionar item ao carrinho",
            "description": "Adiciona um produto ao carrinho do usuário autenticado. Se o produto já existir, incrementa a quantidade.",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/CreateCartItemDTO" }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Item adicionado ao carrinho com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/CartItemResponse" }
                        }
                    }
                },
                "400": {
                    "description": "Erro de validação",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string" },
                                    "errors": { 
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "field": { "type": "string" },
                                                "message": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Usuário não autenticado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não autenticado" }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Produto não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Produto não encontrado" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Erro interno do servidor",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Erro interno do servidor" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/api/v1/cart/items/multiple": {
        "post": {
            "tags": ["Cart"],
            "summary": "Adicionar múltiplos itens ao carrinho",
            "description": "Adiciona múltiplos produtos ao carrinho do usuário autenticado de uma vez.",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/AddMultipleItemsDTO" }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Itens adicionados ao carrinho com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/CartResponse" }
                        }
                    }
                },
                "400": {
                    "description": "Erro de validação",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string" },
                                    "errors": { 
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "field": { "type": "string" },
                                                "message": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Usuário não autenticado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não autenticado" }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Produto não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Produto com ID xxx não encontrado" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Erro interno do servidor",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Erro interno do servidor" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/api/v1/cart/items/{cartItemId}": {
        "put": {
            "tags": ["Cart"],
            "summary": "Atualizar quantidade de um item",
            "description": "Atualiza a quantidade de um item específico no carrinho do usuário autenticado.",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "cartItemId",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID do item do carrinho"
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/UpdateCartItemQuantityDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Quantidade atualizada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/CartItemResponse" }
                        }
                    }
                },
                "400": {
                    "description": "Erro de validação",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string" },
                                    "errors": { 
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "field": { "type": "string" },
                                                "message": { "type": "string" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Usuário não autenticado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não autenticado" }
                                }
                            }
                        }
                    }
                },
                "403": {
                    "description": "Acesso negado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Acesso negado" }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Item não encontrado no carrinho",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Item não encontrado no carrinho" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Erro interno do servidor",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Erro interno do servidor" }
                                }
                            }
                        }
                    }
                }
            }
        },
        "delete": {
            "tags": ["Cart"],
            "summary": "Remover item do carrinho",
            "description": "Remove um item específico do carrinho do usuário autenticado.",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "cartItemId",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID do item do carrinho"
                }
            ],
            "responses": {
                "204": {
                    "description": "Item removido com sucesso"
                },
                "401": {
                    "description": "Usuário não autenticado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não autenticado" }
                                }
                            }
                        }
                    }
                },
                "403": {
                    "description": "Acesso negado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Acesso negado" }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Item não encontrado no carrinho",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Item não encontrado no carrinho" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Erro interno do servidor",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Erro interno do servidor" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/api/v1/cart/delete": {
        "delete": {
            "tags": ["Cart"],
            "summary": "Deletar carrinho",
            "description": "Remove completamente o carrinho do usuário autenticado.",
            "security": [{ "bearerAuth": [] }],
            "responses": {
                "204": {
                    "description": "Carrinho deletado com sucesso"
                },
                "401": {
                    "description": "Usuário não autenticado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não autenticado" }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Carrinho não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Carrinho não encontrado" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Erro interno do servidor",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Erro interno do servidor" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const cartSchemas = {
    "CartResponse": {
        "type": "object",
        "properties": {
            "id": { "type": "string", "example": "507f1f77bcf86cd799439011" },
            "userId": { "type": "string", "example": "507f1f77bcf86cd799439012" },
            "items": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/CartItemResponse" }
            },
            "totalItems": { "type": "integer", "example": 5 },
            "totalValue": { "type": "number", "format": "float", "example": 125.50 },
            "createdAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" }
        }
    },
    "CartItemResponse": { "$ref": "#/components/schemas/CartItemResponse" },
    "CartProduct": { "$ref": "#/components/schemas/CartProduct" },
    "CreateCartItemDTO": { "$ref": "#/components/schemas/CreateCartItemDTO" },
    "AddMultipleItemsDTO": {
        "type": "object",
        "properties": {
            "items": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/CreateCartItemDTO" },
                "minItems": 1
            }
        },
        "required": ["items"]
    },
    "UpdateCartItemQuantityDTO": {
        "type": "object",
        "properties": {
            "quantity": { "type": "integer", "example": 3 }
        },
        "required": ["quantity"]
    }
};

export const cartTags = [
    {
        "name": "Cart",
        "description": "Operações relacionadas ao carrinho de compras"
    }
];