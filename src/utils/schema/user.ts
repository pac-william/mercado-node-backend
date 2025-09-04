export const userPaths = {
    "/api/v1/users": {
        "get": {
            "tags": ["Users"],
            "summary": "Listar todos os usuários",
            "description": "Retorna uma lista paginada de todos os usuários.",

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
                    "description": "Lista de usuários retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/UserPaginatedResponse" }
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
            "tags": ["Users"],
            "summary": "Criar um novo usuário",
            "description": "Cria um novo usuário.",

            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/UserDTO" }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Usuário criado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/User" }
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
                "409": {
                    "description": "Email já está em uso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Email já está em uso" }
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
    "/api/v1/users/{id}": {
        "get": {
            "tags": ["Users"],
            "summary": "Listar um usuário específico",
            "description": "Retorna um usuário específico pelo ID.",

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
                    "description": "Usuário retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/User" }
                        }
                    }
                },
                "404": {
                    "description": "Usuário não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não encontrado" }
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
            "tags": ["Users"],
            "summary": "Atualizar um usuário",
            "description": "Atualiza um usuário existente pelo ID.",

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
                        "schema": { "$ref": "#/components/schemas/UserDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Usuário atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/User" }
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
                    "description": "Usuário não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não encontrado" }
                                }
                            }
                        }
                    }
                },
                "409": {
                    "description": "Email já está em uso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Email já está em uso" }
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
            "tags": ["Users"],
            "summary": "Atualizar parcialmente um usuário",
            "description": "Atualiza parcialmente um usuário existente pelo ID.",

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
                        "schema": { "$ref": "#/components/schemas/UserUpdateDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Usuário atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/User" }
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
                    "description": "Usuário não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não encontrado" }
                                }
                            }
                        }
                    }
                },
                "409": {
                    "description": "Email já está em uso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Email já está em uso" }
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
            "tags": ["Users"],
            "summary": "Deletar um usuário",
            "description": "Remove um usuário existente pelo ID.",

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
                    "description": "Usuário deletado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/User" }
                        }
                    }
                },
                "404": {
                    "description": "Usuário não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário não encontrado" }
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

export const userSchemas = {
    "User": {
        "type": "object",
        "properties": {
            "id": { "type": "string", "example": "507f1f77bcf86cd799439011" },
            "name": { "type": "string", "example": "João Silva" },
            "email": { "type": "string", "example": "joao@email.com" },
            "createdAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" }
        }
    },
    "UserDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "example": "João Silva" },
            "email": { "type": "string", "example": "joao@email.com" },
            "password": { "type": "string", "example": "senha123" }
        },
        "required": ["name", "email", "password"]
    },
    "UserUpdateDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "example": "João Silva Atualizado" },
            "email": { "type": "string", "example": "joao.novo@email.com" },
            "password": { "type": "string", "example": "novaSenha123" }
        }
    },
    "UserPaginatedResponse": {
        "type": "object",
        "properties": {
            "users": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/User" }
            },
            "meta": { "$ref": "#/components/schemas/Meta" }
        }
    }
};

export const userTags = [
    {
        "name": "Users",
        "description": "Operações relacionadas a usuários"
    }
];
