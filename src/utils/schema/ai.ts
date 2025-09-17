export const aiPaths = {
    "/api/v1/ai/produtos/pesquisar": {
        "post": {
            "tags": ["AI"],
            "summary": "Pesquisar produtos com IA",
            "description": "Recebe um prompt em linguagem natural e retorna produtos correspondentes do marketplace usando IA.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "prompt": {
                                    "type": "string",
                                    "example": "Quero fazer um bolo de cenoura",
                                    "description": "Texto em linguagem natural descrevendo o que o usuário quer fazer"
                                }
                            },
                            "required": ["prompt"]
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Produtos encontrados com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "success": { "type": "boolean", "example": true },
                                    "data": {
                                        "type": "object",
                                        "properties": {
                                            "contexto": { "type": "string", "example": "Bolo de cenoura" },
                                            "produtos": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "item_ia": { "type": "string", "example": "cenoura" },
                                                        "produto": {
                                                            "type": "object",
                                                            "properties": {
                                                                "id": { "type": "string", "example": "507f1f77bcf86cd799439011" },
                                                                "nome": { "type": "string", "example": "Cenoura orgânica 500g" },
                                                                "preco": { "type": "number", "example": 5.50 },
                                                                "loja_id": { "type": "string", "example": "507f1f77bcf86cd799439012" },
                                                                "market": {
                                                                    "type": "object",
                                                                    "properties": {
                                                                        "id": { "type": "string" },
                                                                        "name": { "type": "string" },
                                                                        "address": { "type": "string" }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        "status": { "type": "string", "example": "não encontrado" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
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
                                    "success": { "type": "boolean", "example": false },
                                    "message": { "type": "string", "example": "Prompt é obrigatório" }
                                }
                            }
                        }
                    }
                },
                "503": {
                    "description": "Serviço de IA indisponível",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "success": { "type": "boolean", "example": false },
                                    "message": { "type": "string", "example": "Serviço de IA temporariamente indisponível" }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/ai/buscas": {
        "get": {
            "tags": ["AI"],
            "summary": "Listar histórico de buscas",
            "description": "Retorna o histórico de buscas com IA do usuário autenticado.",
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
                }
            ],
            "responses": {
                "200": {
                    "description": "Histórico de buscas retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "success": { "type": "boolean", "example": true },
                                    "data": {
                                        "type": "object",
                                        "properties": {
                                            "searches": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "id": { "type": "string" },
                                                        "prompt": { "type": "string" },
                                                        "aiResponse": { "type": "object" },
                                                        "createdAt": { "type": "string", "format": "date-time" }
                                                    }
                                                }
                                            },
                                            "meta": { "$ref": "#/components/schemas/Meta" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Usuário não autenticado"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/ai/produtos/similares/{productId}": {
        "get": {
            "tags": ["AI"],
            "summary": "Buscar produtos similares",
            "description": "Retorna produtos similares baseado em um produto específico.",
            "parameters": [
                {
                    "name": "productId",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" }
                }
            ],
            "responses": {
                "200": {
                    "description": "Produtos similares retornados com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "success": { "type": "boolean", "example": true },
                                    "data": {
                                        "type": "object",
                                        "properties": {
                                            "productId": { "type": "string" },
                                            "similarProducts": {
                                                "type": "array",
                                                "items": { "$ref": "#/components/schemas/Product" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "ID do produto é obrigatório"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/ai/produtos/categoria/{categoryName}": {
        "get": {
            "tags": ["AI"],
            "summary": "Buscar produtos por categoria",
            "description": "Retorna produtos de uma categoria específica.",
            "parameters": [
                {
                    "name": "categoryName",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" }
                }
            ],
            "responses": {
                "200": {
                    "description": "Produtos da categoria retornados com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "success": { "type": "boolean", "example": true },
                                    "data": {
                                        "type": "object",
                                        "properties": {
                                            "categoryName": { "type": "string" },
                                            "products": {
                                                "type": "array",
                                                "items": { "$ref": "#/components/schemas/Product" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Nome da categoria é obrigatório"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    }
};

export const aiSchemas = {
    "AiSearchRequest": {
        "type": "object",
        "properties": {
            "prompt": {
                "type": "string",
                "example": "Quero fazer um bolo de cenoura",
                "description": "Texto em linguagem natural descrevendo o que o usuário quer fazer"
            }
        },
        "required": ["prompt"]
    },
    "AiSearchResponse": {
        "type": "object",
        "properties": {
            "success": { "type": "boolean", "example": true },
            "data": {
                "type": "object",
                "properties": {
                    "contexto": { "type": "string", "example": "Bolo de cenoura" },
                    "produtos": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "item_ia": { "type": "string", "example": "cenoura" },
                                "produto": {
                                    "type": "object",
                                    "properties": {
                                        "id": { "type": "string" },
                                        "nome": { "type": "string" },
                                        "preco": { "type": "number" },
                                        "loja_id": { "type": "string" },
                                        "market": {
                                            "type": "object",
                                            "properties": {
                                                "id": { "type": "string" },
                                                "name": { "type": "string" },
                                                "address": { "type": "string" }
                                            }
                                        }
                                    }
                                },
                                "status": { "type": "string", "example": "não encontrado" }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const aiTags = [
    {
        "name": "AI",
        "description": "Operações relacionadas à inteligência artificial para pesquisa de produtos"
    }
];
