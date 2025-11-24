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
                },
                {
                    "name": "auth0Id",
                    "in": "query",
                    "description": "Filtrar por Auth0 ID",
                    "required": false,
                    "schema": { "type": "string" }
                }
            ],
            "responses": {
                "200": {
                    "description": "Lista de usuários retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": { "$ref": "#/components/schemas/UserResponseDTO" }
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
                            "schema": { "$ref": "#/components/schemas/UserResponseDTO" }
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
    "/api/v1/users/me": {
        "get": {
            "tags": ["Users"],
            "summary": "Obter dados do usuário autenticado",
            "description": "Retorna os dados do usuário autenticado baseado no token JWT.",
            "security": [{ "bearerAuth": [] }],
            "responses": {
                "200": {
                    "description": "Usuário retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/UserResponseDTO" }
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
        "patch": {
            "tags": ["Users"],
            "summary": "Atualizar parcialmente o usuário autenticado",
            "description": "Atualiza parcialmente os dados do usuário autenticado baseado no token JWT.",
            "security": [{ "bearerAuth": [] }],
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
                            "schema": { "$ref": "#/components/schemas/UserResponseDTO" }
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
        }
    },
    "/api/v1/users/auth0/{auth0Id}": {
        "get": {
            "tags": ["Users"],
            "summary": "Buscar usuário por Auth0 ID",
            "description": "Retorna um usuário específico pelo Auth0 ID.",
            "security": [{ "bearerAuth": [] }],

            "parameters": [
                {
                    "name": "auth0Id",
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
                            "schema": { "$ref": "#/components/schemas/UserResponseDTO" }
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
                "401": {
                    "description": "Não autorizado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Token inválido ou expirado" }
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
            "security": [{ "bearerAuth": [] }],

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
                            "schema": { "$ref": "#/components/schemas/UserResponseDTO" }
                        }
                    }
                },
                "401": {
                    "description": "Não autorizado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Token inválido ou expirado" }
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
            "security": [{ "bearerAuth": [] }],

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
                            "schema": { "$ref": "#/components/schemas/UserResponseDTO" }
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
                    "description": "Não autorizado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Token inválido ou expirado" }
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
            "security": [{ "bearerAuth": [] }],

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
                            "schema": { "$ref": "#/components/schemas/UserResponseDTO" }
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
                    "description": "Não autorizado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Token inválido ou expirado" }
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
            "security": [{ "bearerAuth": [] }],

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
                            "schema": { "$ref": "#/components/schemas/UserResponseDTO" }
                        }
                    }
                },
                "401": {
                    "description": "Não autorizado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Token inválido ou expirado" }
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
            "phone": { "type": "string", "nullable": true, "example": "11999999999" },
            "profilePicture": { "type": "string", "nullable": true, "example": "https://example.com/photo.jpg" },
            "birthDate": { "type": "string", "format": "date", "nullable": true, "example": "1990-01-01" },
            "gender": { "type": "string", "nullable": true, "enum": ["masculino", "feminino", "outro"], "example": "masculino" },
            "address": { "type": "string", "nullable": true, "example": "Rua das Flores, 123" },
            "auth0Id": { "type": "string", "nullable": true, "example": "auth0|123456789" },
            "createdAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" }
        }
    },
    "UserDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "example": "João Silva" },
            "email": { "type": "string", "format": "email", "example": "joao@email.com" },
            "password": { "type": "string", "minLength": 6, "example": "senha123" },
            "phone": { "type": "string", "nullable": true, "example": "11999999999" },
            "profilePicture": { "type": "string", "nullable": true, "example": "https://example.com/photo.jpg" },
            "birthDate": { "type": "string", "nullable": true, "example": "1990-01-01" },
            "gender": { "type": "string", "nullable": true, "example": "masculino" },
            "address": { "type": "string", "nullable": true, "example": "Rua das Flores, 123" },
            "auth0Id": { "type": "string", "nullable": true, "example": "auth0|123456789" }
        },
        "required": ["name", "email"]
    },
    "UserUpdateDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "example": "João Silva Atualizado" },
            "email": { "type": "string", "format": "email", "example": "joao.novo@email.com" },
            "password": { "type": "string", "minLength": 6, "example": "novaSenha123" },
            "phone": { "type": "string", "nullable": true, "example": "11999999999" },
            "profilePicture": { "type": "string", "nullable": true, "example": "https://example.com/photo.jpg" },
            "birthDate": { "type": "string", "nullable": true, "example": "1990-01-01" },
            "gender": { "type": "string", "nullable": true, "enum": ["masculino", "feminino", "outro"], "example": "masculino" },
            "address": { "type": "string", "nullable": true, "example": "Rua das Flores, 123" },
            "auth0Id": { "type": "string", "nullable": true, "example": "auth0|123456789" }
        }
    },
    "UserResponseDTO": {
        "type": "object",
        "properties": {
            "id": { "type": "string", "example": "507f1f77bcf86cd799439011" },
            "name": { "type": "string", "example": "João Silva" },
            "email": { "type": "string", "example": "joao@email.com" },
            "createdAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" }
        }
    },
    "ProfileResponseDTO": {
        "type": "object",
        "properties": {
            "id": { "type": "string", "example": "507f1f77bcf86cd799439011" },
            "name": { "type": "string", "example": "João Silva" },
            "email": { "type": "string", "example": "joao@email.com" },
            "phone": { "type": "string", "nullable": true, "example": "11999999999" },
            "profilePicture": { "type": "string", "nullable": true, "example": "https://example.com/photo.jpg" },
            "birthDate": { "type": "string", "format": "date-time", "nullable": true, "example": "1990-01-01T00:00:00Z" },
            "gender": { "type": "string", "nullable": true, "example": "masculino" },
            "address": { "type": "string", "nullable": true, "example": "Rua das Flores, 123" },
            "role": { "type": "string", "example": "customer" },
            "marketId": { "type": "string", "nullable": true, "example": "507f1f77bcf86cd799439012" },
            "market": {
                "type": "object",
                "nullable": true,
                "properties": {
                    "id": { "type": "string", "example": "507f1f77bcf86cd799439012" },
                    "name": { "type": "string", "example": "Supermercado ABC" },
                    "address": { "type": "string", "example": "Rua do Comércio, 456" },
                    "profilePicture": { "type": "string", "nullable": true, "example": "https://example.com/market.jpg" }
                }
            },
            "createdAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2024-07-16T00:00:00Z" }
        }
    },
    "ProfileUpdateDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "minLength": 1, "nullable": true, "example": "João Silva Atualizado" },
            "email": { "type": "string", "format": "email", "nullable": true, "example": "joao.novo@email.com" },
            "phone": { "type": "string", "minLength": 10, "nullable": true, "example": "11999999999" },
            "profilePicture": { "type": "string", "format": "uri", "nullable": true, "example": "https://example.com/photo.jpg" },
            "birthDate": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$", "nullable": true, "example": "1990-01-01" },
            "gender": { "type": "string", "enum": ["masculino", "feminino", "outro"], "nullable": true, "example": "masculino" },
            "address": { "type": "string", "minLength": 5, "nullable": true, "example": "Rua das Flores, 123" },
            "password": { "type": "string", "minLength": 6, "nullable": true, "example": "novaSenha123" }
        }
    },
    "UserPaginatedResponse": {
        "type": "object",
        "properties": {
            "users": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/UserResponseDTO" }
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
