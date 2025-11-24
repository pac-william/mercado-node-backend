export const productPaths = {
    "/api/v1/products": {
        "get": {
            "tags": ["Products"],
            "summary": "Listar todos os produtos",
            "description": "Retorna uma lista paginada de todos os produtos.",

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
                    "description": "Nome do produto para filtrar",
                    "required": false,
                    "schema": { "type": "string" }
                },
                {
                    "name": "minPrice",
                    "in": "query",
                    "description": "Preço mínimo para filtrar",
                    "required": false,
                    "schema": { "type": "number" }
                },
                {
                    "name": "maxPrice",
                    "in": "query",
                    "description": "Preço máximo para filtrar",
                    "required": false,
                    "schema": { "type": "number" }
                },
                {
                    "name": "marketId",
                    "in": "query",
                    "description": "ID do mercado para filtrar produtos",
                    "required": false,
                    "schema": { "type": "string" }
                },
                {
                    "name": "categoryId",
                    "in": "query",
                    "description": "IDs das categorias para filtrar produtos (pode repetir o parâmetro)",
                    "required": false,
                    "schema": {
                        "type": "array",
                        "items": { "type": "string" }
                    },
                    "style": "form",
                    "explode": true
                }
            ],
            "responses": {
                "200": {
                    "description": "Lista de produtos retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/ProductPaginatedResponse" }
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
            "tags": ["Products"],
            "summary": "Criar um novo produto",
            "description": "Cria um novo produto. Suporta imagens base64 com limite de 5MB.",

            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/ProductDTO" }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Produto criado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Product" }
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
    "/api/v1/markets/{marketId}/products": {
        "get": {
            "tags": ["Products"],
            "summary": "Listar produtos de um mercado específico",
            "description": "Retorna uma lista paginada de produtos de um mercado específico.",

            "parameters": [
                {
                    "name": "marketId",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" }
                },
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
                    "name": "categoryId",
                    "in": "query",
                    "description": "IDs das categorias para filtrar produtos (pode repetir o parâmetro)",
                    "required": false,
                    "schema": {
                        "type": "array",
                        "items": { "type": "string" }
                    },
                    "style": "form",
                    "explode": true
                }
            ],
            "responses": {
                "200": {
                    "description": "Lista de produtos do mercado retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/ProductPaginatedResponse" }
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
    },
    "/api/v1/products/{id}": {
        "get": {
            "tags": ["Products"],
            "summary": "Listar um produto específico",
            "description": "Retorna um produto específico pelo ID.",

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
                    "description": "Produto retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Product" }
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
        },
        "put": {
            "tags": ["Products"],
            "summary": "Atualizar um produto",
            "description": "Atualiza um produto existente pelo ID. Suporta imagens base64 com limite de 5MB.",

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
                        "schema": { "$ref": "#/components/schemas/ProductDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Produto atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Product" }
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
        },
        "patch": {
            "tags": ["Products"],
            "summary": "Atualizar parcialmente um produto",
            "description": "Atualiza parcialmente um produto existente pelo ID. Suporta imagens base64 com limite de 5MB.",

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
                        "schema": { "$ref": "#/components/schemas/ProductUpdateDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Produto atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Product" }
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
        },
        "delete": {
            "tags": ["Products"],
            "summary": "Deletar um produto",
            "description": "Remove um produto existente pelo ID.",

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
                    "description": "Produto deletado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Product" }
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
    }
};

export const productSchemas = {
    "Product": {
        "type": "object",
        "properties": {
            "id": { "type": "string", "example": "507f1f77bcf86cd799439011" },
            "name": { "type": "string", "example": "Produto Exemplo" },
            "price": { "type": "number", "format": "float", "example": 29.99 },
            "unit": { "type": "string", "example": "unidade" },
            "marketId": { "type": "string", "example": "507f1f77bcf86cd799439012" },
            "categoryId": { "type": "string", "example": "507f1f77bcf86cd799439013" },
            "image": { "type": "string", "description": "Imagem do produto em base64", "example": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." },
            "createdAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" }
        }
    },
    "ProductDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "example": "Produto Exemplo" },
            "price": { "type": "number", "format": "float", "example": 29.99 },
            "unit": { "type": "string", "example": "unidade" },
            "marketId": { "type": "string", "example": "507f1f77bcf86cd799439012" },
            "categoryId": { "type": "string", "example": "507f1f77bcf86cd799439013" },
            "image": { "type": "string", "description": "Imagem do produto em base64", "example": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." }
        },
        "required": ["name", "price", "marketId"]
    },
    "ProductUpdateDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "example": "Produto Exemplo Atualizado" },
            "price": { "type": "number", "format": "float", "example": 39.99 },
            "unit": { "type": "string", "example": "unidade" },
            "marketId": { "type": "string", "example": "507f1f77bcf86cd799439012" },
            "categoryId": { "type": "string", "example": "507f1f77bcf86cd799439013" },
            "image": { "type": "string", "description": "Imagem do produto em base64", "example": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." }
        }
    },
    "ProductPaginatedResponse": {
        "type": "object",
        "properties": {
            "products": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/Product" }
            },
            "meta": { "$ref": "#/components/schemas/Meta" }
        }
    }
};

export const productTags = [
    {
        "name": "Products",
        "description": "Operações relacionadas a produtos"
    }
];
