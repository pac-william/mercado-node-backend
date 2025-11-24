export const marketPaths = {
    "/api/v1/markets": {
        "get": {
            "tags": ["Markets"],
            "summary": "Listar todos os mercados",
            "description": "Retorna uma lista paginada de todos os mercados.",

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
                    "name": "name",
                    "in": "query",
                    "description": "Nome do mercado para filtrar",
                    "required": false,
                    "schema": { "type": "string" }
                },
                {
                    "name": "address",
                    "in": "query",
                    "description": "Endereço do mercado para filtrar",
                    "required": false,
                    "schema": { "type": "string" }
                },
                {
                    "name": "ownerId",
                    "in": "query",
                    "description": "ID do proprietário para filtrar",
                    "required": false,
                    "schema": { "type": "string", "example": "507f1f77bcf86cd799439011" }
                },
                {
                    "name": "managersIds",
                    "in": "query",
                    "description": "IDs dos gerentes para filtrar (repita o parâmetro para múltiplos valores)",
                    "required": false,
                    "schema": {
                        "type": "array",
                        "items": { "type": "string", "example": "507f1f77bcf86cd799439012" }
                    },
                    "style": "form",
                    "explode": true
                }
            ],
            "responses": {
                "200": {
                    "description": "Lista de mercados retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/MarketPaginatedResponse" }
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
        "post": {
            "tags": ["Markets"],
            "summary": "Criar um novo mercado",
            "description": "Cria um novo mercado.",

            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/MarketDTO" }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Mercado criado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Market" }
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
    "/api/v1/markets/{id}": {
        "get": {
            "tags": ["Markets"],
            "summary": "Listar um mercado específico",
            "description": "Retorna um mercado específico pelo ID.",

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
                    "description": "Mercado retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Market" }
                        }
                    }
                },
                "404": {
                    "description": "Mercado não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Mercado não encontrado" }
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
            "tags": ["Markets"],
            "summary": "Atualizar um mercado",
            "description": "Atualiza um mercado existente pelo ID.",

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
                        "schema": { "$ref": "#/components/schemas/MarketDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Mercado atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Market" }
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
                "404": {
                    "description": "Mercado não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Mercado não encontrado" }
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
        "patch": {
            "tags": ["Markets"],
            "summary": "Atualizar parcialmente um mercado",
            "description": "Atualiza parcialmente um mercado existente pelo ID.",

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
                        "schema": { "$ref": "#/components/schemas/MarketUpdateDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Mercado atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Market" }
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
                "404": {
                    "description": "Mercado não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Mercado não encontrado" }
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
            "tags": ["Markets"],
            "summary": "Deletar um mercado",
            "description": "Remove um mercado existente pelo ID.",

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
                    "description": "Mercado deletado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Market" }
                        }
                    }
                },
                "404": {
                    "description": "Mercado não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Mercado não encontrado" }
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

export const marketSchemas = {
    "Market": {
        "type": "object",
        "properties": {
            "id": { "type": "string", "example": "507f1f77bcf86cd799439011" },
            "name": { "type": "string", "example": "Supermercado Central" },
            "address": { "type": "string", "example": "Rua das Flores, 123, Centro" },
            "profilePicture": { "type": "string", "example": "https://example.com/logo.png" },
            "ownerId": { "type": "string", "example": "507f1f77bcf86cd799439011" },
            "managersIds": {
                "type": "array",
                "items": { "type": "string", "example": "507f1f77bcf86cd799439012" }
            },
            "products": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/Product" }
            },
            "createdAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" }
        }
    },
    "MarketDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "example": "Supermercado Central" },
            "address": { "type": "string", "example": "Rua das Flores, 123, Centro" },
            "profilePicture": { "type": "string", "example": "https://example.com/logo.png" },
            "ownerId": { "type": "string", "example": "507f1f77bcf86cd799439011" },
            "managersIds": {
                "type": "array",
                "items": { "type": "string", "example": "507f1f77bcf86cd799439012" }
            }
        },
        "required": ["name", "address", "ownerId"]
    },
    "MarketUpdateDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "example": "Supermercado Central Atualizado" },
            "address": { "type": "string", "example": "Rua das Flores, 456, Centro" },
            "profilePicture": { "type": "string", "example": "https://example.com/new-logo.png" }
        }
    },
    "MarketPaginatedResponse": {
        "type": "object",
        "properties": {
            "markets": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/Market" }
            },
            "meta": { "$ref": "#/components/schemas/Meta" }
        }
    }
};

export const marketTags = [
    {
        "name": "Markets",
        "description": "Operações relacionadas a mercados"
    }
];
