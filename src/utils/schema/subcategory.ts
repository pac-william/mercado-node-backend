export const subcategoryPaths = {
    "/api/v1/subcategories": {
        "get": {
            "tags": ["Subcategories"],
            "summary": "Listar subcategorias",
            "description": "Lista subcategorias com filtros opcionais por nome ou categoria.",
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
                    "name": "categoryId",
                    "in": "query",
                    "description": "ID da categoria para filtrar",
                    "required": false,
                    "schema": { "type": "string" }
                },
                {
                    "name": "name",
                    "in": "query",
                    "description": "Nome parcial para buscar subcategorias",
                    "required": false,
                    "schema": { "type": "string" }
                }
            ],
            "responses": {
                "200": {
                    "description": "Subcategorias listadas com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "subcategories": {
                                        "type": "array",
                                        "items": { "$ref": "#/components/schemas/Subcategory" }
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
            "tags": ["Subcategories"],
            "summary": "Criar subcategoria",
            "description": "Cria uma nova subcategoria vinculada a uma categoria existente.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/SubcategoryDTO" }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Subcategoria criada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Subcategory" }
                        }
                    }
                },
                "409": {
                    "description": "Subcategoria duplicada",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Subcategoria com este nome já existe" }
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
    "/api/v1/subcategories/{id}": {
        "get": {
            "tags": ["Subcategories"],
            "summary": "Buscar subcategoria por ID",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID da subcategoria"
                }
            ],
            "responses": {
                "200": {
                    "description": "Subcategoria encontrada",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Subcategory" }
                        }
                    }
                },
                "404": {
                    "description": "Subcategoria não encontrada",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Subcategoria não encontrada" }
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
            "tags": ["Subcategories"],
            "summary": "Atualizar subcategoria",
            "description": "Atualiza todos os campos de uma subcategoria existente.",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID da subcategoria"
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/SubcategoryDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Subcategoria atualizada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Subcategory" }
                        }
                    }
                },
                "404": {
                    "description": "Subcategoria não encontrada",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Subcategoria não encontrada" }
                                }
                            }
                        }
                    }
                },
                "409": {
                    "description": "Subcategoria com este nome já existe",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Subcategoria com este nome já existe" }
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
            "tags": ["Subcategories"],
            "summary": "Atualizar subcategoria parcialmente",
            "description": "Atualiza campos específicos de uma subcategoria.",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID da subcategoria"
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/SubcategoryUpdateDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Subcategoria atualizada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Subcategory" }
                        }
                    }
                },
                "404": {
                    "description": "Subcategoria não encontrada",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Subcategoria não encontrada" }
                                }
                            }
                        }
                    }
                },
                "409": {
                    "description": "Subcategoria com este nome já existe",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Subcategoria com este nome já existe" }
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
            "tags": ["Subcategories"],
            "summary": "Remover subcategoria",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID da subcategoria"
                }
            ],
            "responses": {
                "200": {
                    "description": "Subcategoria removida com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Subcategory" }
                        }
                    }
                },
                "404": {
                    "description": "Subcategoria não encontrada",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Subcategoria não encontrada" }
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

export const subcategorySchemas = {
    "Subcategory": {
        "type": "object",
        "properties": {
            "id": { "type": "string", "example": "507f1f77bcf86cd799439014" },
            "name": { "type": "string", "example": "Frutas Cítricas" },
            "slug": { "type": "string", "example": "frutas-citricas" },
            "description": { "type": "string", "example": "Subcategoria para frutas cítricas" },
            "categoryId": { "type": "string", "example": "507f1f77bcf86cd799439013" },
            "createdAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" }
        },
        "required": ["id", "name", "slug", "description", "categoryId", "createdAt", "updatedAt"]
    },
    "SubcategoryDTO": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "example": "Frutas Cítricas",
                "description": "Nome da subcategoria"
            },
            "categoryId": {
                "type": "string",
                "example": "507f1f77bcf86cd799439013",
                "description": "ID da categoria pai"
            },
            "description": {
                "type": "string",
                "example": "Subcategoria para frutas cítricas",
                "description": "Descrição da subcategoria"
            }
        },
        "required": ["name", "categoryId"]
    },
    "SubcategoryUpdateDTO": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "example": "Frutas Cítricas",
                "description": "Nome da subcategoria"
            },
            "categoryId": {
                "type": "string",
                "example": "507f1f77bcf86cd799439013",
                "description": "ID da categoria pai"
            },
            "description": {
                "type": "string",
                "example": "Subcategoria para frutas cítricas",
                "description": "Descrição da subcategoria"
            }
        }
    }
};

export const subcategoryTags = [
    {
        "name": "Subcategories",
        "description": "Operações relacionadas às subcategorias"
    }
];

