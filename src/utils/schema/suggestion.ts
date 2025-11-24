export const suggestionPaths = {
    "/api/v1/suggestions": {
        "get": {
            "tags": ["Suggestions"],
            "summary": "Listar todas as sugestões",
            "description": "Retorna uma lista paginada de todas as sugestões do usuário autenticado salvas no banco de dados.",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "page",
                    "in": "query",
                    "required": false,
                    "description": "Número da página",
                    "schema": {
                        "type": "integer",
                        "default": 1,
                        "minimum": 1,
                        "example": 1
                    }
                },
                {
                    "name": "size",
                    "in": "query",
                    "required": false,
                    "description": "Quantidade de itens por página",
                    "schema": {
                        "type": "integer",
                        "default": 10,
                        "minimum": 1,
                        "maximum": 100,
                        "example": 10
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Sugestões retornadas com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/SuggestionPaginatedResponse" }
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
            "tags": ["Suggestions"],
            "summary": "Criar sugestões de produtos",
            "description": "Cria sugestões baseadas em IA como uma lista única de itens, cada um com tipo (essential, common, utensil), e salva no banco de dados.",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "task": {
                                    "type": "string",
                                    "description": "Tarefa a ser realizada. Exemplo: quero fazer um pudim de leite",
                                    "example": "Quero fazer um pudim de leite"
                                }
                            },
                            "required": ["task"]
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Sugestão criada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/SuggestionCreateResponse" }
                        }
                    }
                },
                "400": {
                    "description": "Tarefa não informada",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object", "properties": { "message": { "type": "string", "example": "Tarefa não informada" } } }
                        }
                    }
                },
                "401": {
                    "description": "Usuário não autenticado",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object", "properties": { "message": { "type": "string", "example": "Usuário não autenticado" } } }
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
    "/api/v1/suggestions/user/me": {
        "get": {
            "tags": ["Suggestions"],
            "summary": "Listar sugestões do usuário logado",
            "description": "Retorna uma lista paginada de todas as sugestões do usuário autenticado.",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "page",
                    "in": "query",
                    "required": false,
                    "description": "Número da página",
                    "schema": {
                        "type": "integer",
                        "default": 1,
                        "minimum": 1,
                        "example": 1
                    }
                },
                {
                    "name": "size",
                    "in": "query",
                    "required": false,
                    "description": "Quantidade de itens por página",
                    "schema": {
                        "type": "integer",
                        "default": 10,
                        "minimum": 1,
                        "maximum": 100,
                        "example": 10
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Sugestões retornadas com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/SuggestionPaginatedResponse" }
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
    "/api/v1/suggestions/{id}": {
        "get": {
            "tags": ["Suggestions"],
            "summary": "Obter sugestão por ID",
            "description": "Retorna uma sugestão completa do usuário autenticado salva no banco de dados pelo ID.",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "description": "ID da sugestão",
                    "schema": {
                        "type": "string",
                        "example": "507f1f77bcf86cd799439011"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Sugestão retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Suggestion" }
                        }
                    }
                },
                "400": {
                    "description": "ID não informado",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object", "properties": { "message": { "type": "string", "example": "ID não informado" } } }
                        }
                    }
                },
                "404": {
                    "description": "Sugestão não encontrada",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object", "properties": { "message": { "type": "string", "example": "Sugestão não encontrada" } } }
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

export const suggestionSchemas = {
    "SuggestionListItem": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "description": "ID da sugestão",
                "example": "507f1f77bcf86cd799439011"
            }
        },
        "required": ["id"],
        "additionalProperties": false
    },
    "SuggestionPaginatedResponse": {
        "type": "object",
        "properties": {
            "suggestions": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/SuggestionListItem" }
            },
            "meta": {
                "type": "object",
                "properties": {
                    "page": {
                        "type": "integer",
                        "description": "Página atual",
                        "example": 1
                    },
                    "size": {
                        "type": "integer",
                        "description": "Itens por página",
                        "example": 10
                    },
                    "total": {
                        "type": "integer",
                        "description": "Total de itens",
                        "example": 50
                    },
                    "totalPages": {
                        "type": "integer",
                        "description": "Total de páginas",
                        "example": 5
                    },
                    "totalItems": {
                        "type": "integer",
                        "description": "Total de itens",
                        "example": 50
                    }
                },
                "required": ["page", "size", "total", "totalPages", "totalItems"]
            }
        },
        "required": ["suggestions", "meta"],
        "additionalProperties": false
    },
    "SuggestionCreateResponse": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "description": "ID da sugestão criada",
                "example": "507f1f77bcf86cd799439011"
            }
        },
        "required": ["id"],
        "additionalProperties": false
    },
    "Suggestion": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "description": "ID da sugestão",
                "example": "507f1f77bcf86cd799439011"
            },
            "userId": {
                "type": "string",
                "description": "ID do usuário que criou a sugestão",
                "example": "507f1f77bcf86cd799439012"
            },
            "task": {
                "type": "string",
                "description": "Tarefa solicitada",
                "example": "Quero fazer um pudim de leite"
            },
            "data": {
                "type": "object",
                "description": "Dados completos da sugestão gerada pela IA",
                "properties": {
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": { "type": "string" },
                                "categoryId": { "type": "string" },
                                "categoryName": { "type": "string" },
                                "type": { "type": "string", "enum": ["essential", "common", "utensil"] }
                            }
                        }
                    },
                    "searchResults": {
                        "type": "object",
                        "properties": {
                            "productsBySearchTerm": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "searchTerm": { "type": "string" },
                                        "categoryName": { "type": "string" },
                                        "products": { "type": "array" },
                                        "meta": {
                                            "type": "object",
                                            "properties": {
                                                "total": { "type": "number" },
                                                "page": { "type": "number" },
                                                "size": { "type": "number" }
                                            }
                                        }
                                    }
                                }
                            },
                            "statistics": {
                                "type": "object",
                                "properties": {
                                    "totalSearches": { "type": "number" },
                                    "totalProductsFound": { "type": "number" },
                                    "searchTerms": {
                                        "type": "array",
                                        "items": { "type": "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "createdAt": {
                "type": "string",
                "format": "date-time",
                "description": "Data de criação da sugestão"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time",
                "description": "Data da última atualização"
            }
        },
        "required": ["id", "userId", "task", "data", "createdAt", "updatedAt"],
        "additionalProperties": false
    },
    "SuggestionResponse": {
        "type": "object",
        "properties": {
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": { "type": "string" },
                        "categoryId": { "type": "string" },
                        "categoryName": { "type": "string" },
                        "type": { "type": "string", "enum": ["essential", "common", "utensil"] }
                    }
                },
                "description": "Lista única de itens com tipo (essential, common, utensil)"
            },
            "searchResults": {
                "type": "object",
                "properties": {
                    "productsBySearchTerm": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "searchTerm": { "type": "string" },
                                "categoryName": { "type": "string" },
                                "products": { "type": "array" },
                                "meta": {
                                    "type": "object",
                                    "properties": {
                                        "total": { "type": "number" },
                                        "page": { "type": "number" },
                                        "size": { "type": "number" }
                                    }
                                }
                            }
                        }
                    },
                    "statistics": {
                        "type": "object",
                        "properties": {
                            "totalSearches": { "type": "number" },
                            "totalProductsFound": { "type": "number" },
                            "searchTerms": {
                                "type": "array",
                                "items": { "type": "string" }
                            }
                        }
                    }
                }
            }
        },
        "required": ["items"],
        "additionalProperties": false
    }
};

export const suggestionTags = [
    {   
        "name": "Suggestions",
        "description": "Operações relacionadas a sugestões"
    }
];
