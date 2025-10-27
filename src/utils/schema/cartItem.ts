export const cartItemPaths = {
    "/api/v1/cart-items/{cartId}/items": {
        "post": {
            "tags": ["Cart Items"],
            "summary": "Adicionar item ao carrinho",
            "description": "Adiciona um produto ao carrinho especificado. Se o produto já existir no carrinho, incrementa a quantidade.",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "cartId",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID do carrinho"
                }
            ],
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
                "400": {
                    "description": "Dados inválidos",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Dados inválidos" },
                                    "errors": { "type": "array" }
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
        "get": {
            "tags": ["Cart Items"],
            "summary": "Listar itens do carrinho",
            "description": "Retorna todos os itens do carrinho especificado.",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "cartId",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID do carrinho"
                }
            ],
            "responses": {
                "200": {
                    "description": "Lista de itens retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": { "$ref": "#/components/schemas/CartItemResponse" }
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
    "/api/v1/cart-items/items/{id}": {
        "get": {
            "tags": ["Cart Items"],
            "summary": "Buscar item do carrinho por ID",
            "description": "Retorna um item específico do carrinho pelo seu ID.",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID do item do carrinho"
                }
            ],
            "responses": {
                "200": {
                    "description": "Item retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/CartItemResponse" }
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
                    "description": "Item do carrinho não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Item do carrinho não encontrado" }
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
        "put": {
            "tags": ["Cart Items"],
            "summary": "Atualizar quantidade do item",
            "description": "Atualiza a quantidade de um item específico no carrinho.",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "id",
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
                        "schema": { "$ref": "#/components/schemas/UpdateCartItemDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Item atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/CartItemResponse" }
                        }
                    }
                },
                "400": {
                    "description": "Dados inválidos",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Dados inválidos" },
                                    "errors": { "type": "array" }
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
                    "description": "Item do carrinho não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Item do carrinho não encontrado" }
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
            "tags": ["Cart Items"],
            "summary": "Remover item do carrinho",
            "description": "Remove um item específico do carrinho pelo seu ID.",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "id",
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
                "404": {
                    "description": "Item do carrinho não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Item do carrinho não encontrado" }
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

export const cartItemSchemas = {
    CreateCartItemDTO: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
            productId: {
                type: "string",
                description: "ID do produto",
                example: "507f1f77bcf86cd799439011"
            },
            quantity: {
                type: "integer",
                minimum: 1,
                description: "Quantidade do produto",
                example: 2
            }
        }
    },
    UpdateCartItemDTO: {
        type: "object",
        required: ["quantity"],
        properties: {
            quantity: {
                type: "integer",
                minimum: 1,
                description: "Nova quantidade do produto",
                example: 3
            }
        }
    },
    CartProduct: {
        type: "object",
        properties: {
            id: {
                type: "string",
                example: "507f1f77bcf86cd799439012"
            },
            name: {
                type: "string",
                example: "Produto Exemplo"
            },
            price: {
                type: "number",
                format: "float",
                example: 29.99
            },
            unit: {
                type: "string",
                example: "unidade"
            },
            image: {
                type: "string",
                description: "Imagem do produto em base64",
                example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
            },
            marketId: {
                type: "string",
                example: "507f1f77bcf86cd799439013"
            }
        }
    },
    CartItemResponse: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "ID do item do carrinho",
                example: "507f1f77bcf86cd799439011"
            },
            productId: {
                type: "string",
                description: "ID do produto",
                example: "507f1f77bcf86cd799439011"
            },
            quantity: {
                type: "integer",
                description: "Quantidade do produto",
                example: 2
            },
            product: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "ID do produto",
                        example: "507f1f77bcf86cd799439011"
                    },
                    name: {
                        type: "string",
                        description: "Nome do produto",
                        example: "Arroz Tio João"
                    },
                    price: {
                        type: "number",
                        description: "Preço do produto",
                        example: 12.50
                    },
                    unit: {
                        type: "string",
                        description: "Unidade de medida",
                        example: "kg"
                    },
                    image: {
                        type: "string",
                        nullable: true,
                        description: "URL da imagem do produto",
                        example: "https://example.com/image.jpg"
                    },
                    marketId: {
                        type: "string",
                        description: "ID do mercado",
                        example: "507f1f77bcf86cd799439011"
                    }
                }
            },
            createdAt: {
                type: "string",
                format: "date-time",
                description: "Data de criação"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                description: "Data de atualização"
            }
        }
    }
};

export const cartItemTags = [
    {
        name: "Cart Items",
        description: "Operações relacionadas a itens do carrinho"
    }
];
