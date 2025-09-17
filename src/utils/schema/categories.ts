export const categoriesPaths = {
    "/api/v1/categories": {
        "get": {
            "tags": ["Categories"],
            "summary": "Listar todas as categorias",
            "description": "Retorna uma lista de todas as categorias disponíveis.",
            "responses": {
                "200": {
                    "description": "Lista de categorias retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": { "$ref": "#/components/schemas/Category" }
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
    "/api/v1/categories/{categoryId}/products": {
        "get": {
            "tags": ["Categories"],
            "summary": "Listar produtos de uma categoria específica",
            "description": "Retorna uma lista paginada de produtos de uma categoria específica.",
            "parameters": [
                {
                    "name": "categoryId",
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
                }
            ],
            "responses": {
                "200": {
                    "description": "Lista de produtos da categoria retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "products": {
                                        "type": "array",
                                        "items": { "$ref": "#/components/schemas/Product" }
                                    },
                                    "meta": { "$ref": "#/components/schemas/Meta" }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Categoria não encontrada",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Categoria não encontrada" }
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

export const categoriesSchemas = {
    "Category": {
        "type": "object",
        "properties": {
            "id": { "type": "string", "example": "507f1f77bcf86cd799439013" },
            "name": { "type": "string", "example": "Frutas" },
            "slug": { "type": "string", "example": "frutas" },
            "description": { "type": "string", "example": "Categoria para frutas frescas" },
            "subCategories": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string", "example": "Frutas Cítricas" },
                        "slug": { "type": "string", "example": "frutas-citricas" },
                        "description": { "type": "string", "example": "Frutas cítricas como laranja, limão, etc." }
                    }
                }
            },
            "createdAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" }
        }
    }
};

export const categoriesTags = [
    {
        "name": "Categories",
        "description": "Operações relacionadas a categorias"
    }
];
