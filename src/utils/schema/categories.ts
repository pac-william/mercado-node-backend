export const categoriesPaths = {
    "/api/v1/categories": {
        "get": {
            "tags": ["Categories"],
            "summary": "Listar categorias",
            "description": "Retorna uma lista paginada de categorias com filtros opcionais.",
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
                    "description": "Nome da categoria para filtrar",
                    "required": false,
                    "schema": { "type": "string" }
                }
            ],
            "responses": {
                "200": {
                    "description": "Lista de categorias retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "categories": {
                                        "type": "array",
                                        "items": { "$ref": "#/components/schemas/Category" }
                                    },
                                    "meta": { "$ref": "#/components/schemas/Meta" }
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
        "post": {
            "tags": ["Categories"],
            "summary": "Criar nova categoria",
            "description": "Cria uma nova categoria no sistema.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/CategoryDTO" }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Categoria criada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Category" }
                        }
                    }
                },
                "409": {
                    "description": "Categoria com este nome já existe",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Categoria com este nome já existe" }
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
    "/api/v1/categories/{id}": {
        "get": {
            "tags": ["Categories"],
            "summary": "Buscar categoria por ID",
            "description": "Retorna uma categoria específica pelo seu ID.",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID da categoria"
                }
            ],
            "responses": {
                "200": {
                    "description": "Categoria encontrada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Category" }
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
        },
        "put": {
            "tags": ["Categories"],
            "summary": "Atualizar categoria",
            "description": "Atualiza uma categoria existente.",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID da categoria"
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/CategoryDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Categoria atualizada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Category" }
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
                "409": {
                    "description": "Categoria com este nome já existe",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Categoria com este nome já existe" }
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
            "tags": ["Categories"],
            "summary": "Atualizar categoria parcialmente",
            "description": "Atualiza parcialmente uma categoria existente.",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID da categoria"
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/CategoryUpdateDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Categoria atualizada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Category" }
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
                "409": {
                    "description": "Categoria com este nome já existe",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Categoria com este nome já existe" }
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
            "tags": ["Categories"],
            "summary": "Deletar categoria",
            "description": "Remove uma categoria do sistema.",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID da categoria"
                }
            ],
            "responses": {
                "200": {
                    "description": "Categoria deletada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Category" }
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
        },
        "required": ["id", "name", "slug", "description", "subCategories", "createdAt", "updatedAt"]
    },
    "CategoryDTO": {
        "type": "object",
        "properties": {
            "name": { 
                "type": "string", 
                "example": "Frutas",
                "description": "Nome da categoria"
            },
            "description": { 
                "type": "string", 
                "example": "Categoria para frutas frescas",
                "description": "Descrição da categoria"
            }
        },
        "required": ["name"]
    },
    "CategoryUpdateDTO": {
        "type": "object",
        "properties": {
            "name": { 
                "type": "string", 
                "example": "Frutas Atualizadas",
                "description": "Nome da categoria"
            },
            "description": { 
                "type": "string", 
                "example": "Categoria atualizada para frutas frescas",
                "description": "Descrição da categoria"
            }
        }
    }
};

export const categoriesTags = [
    {
        "name": "Categories",
        "description": "Operações relacionadas a categorias"
    }
];
