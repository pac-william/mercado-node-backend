export const authPaths = {
    "/api/v1/auth/register/user": {
        "post": {
            "tags": ["Auth"],
            "summary": "Registrar usuário",
            "description": "Registra um novo usuário no sistema. Se marketId for fornecido, o usuário será automaticamente vinculado ao mercado como administrador.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/AuthRegisterUserRequest"
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Usuário registrado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário registrado com sucesso" },
                                    "userId": { "type": "string" },
                                    "role": { "type": "string", "enum": ["CUSTOMER", "MARKET_ADMIN"] },
                                    "marketId": { "type": "string", "nullable": true }
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
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/auth/create-market": {
        "post": {
            "tags": ["Auth"],
            "summary": "Criar mercado",
            "description": "Cria um novo mercado (apenas para administradores de mercado)",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/AuthCreateMarketRequest"
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Mercado criado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Mercado criado com sucesso" },
                                    "marketId": { "type": "string" }
                                }
                            }
                        }
                    }
                },
                "401": { "description": "Não autorizado" },
                "403": { "description": "Acesso negado" },
                "500": { "description": "Erro interno do servidor" }
            }
        }
    },
    "/api/v1/auth/link-user-to-market": {
        "post": {
            "tags": ["Auth"],
            "summary": "Vincular usuário ao mercado",
            "description": "Vincula um usuário existente a um mercado, tornando-o administrador do mercado",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/AuthLinkUserToMarketRequest"
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Usuário vinculado ao mercado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário vinculado ao mercado com sucesso" },
                                    "userId": { "type": "string" },
                                    "marketId": { "type": "string" },
                                    "role": { "type": "string", "example": "MARKET_ADMIN" }
                                }
                            }
                        }
                    }
                },
                "401": { "description": "Não autorizado" },
                "403": { "description": "Acesso negado" },
                "404": { "description": "Usuário ou mercado não encontrado" },
                "500": { "description": "Erro interno do servidor" }
            }
        }
    },
    "/api/v1/auth/unlink-user-from-market/{userId}": {
        "delete": {
            "tags": ["Auth"],
            "summary": "Desvincular usuário do mercado",
            "description": "Remove a vinculação de um usuário com um mercado, tornando-o apenas cliente",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "userId",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" }
                }
            ],
            "responses": {
                "200": {
                    "description": "Usuário desvinculado do mercado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Usuário desvinculado do mercado com sucesso" },
                                    "userId": { "type": "string" },
                                    "role": { "type": "string", "example": "CUSTOMER" }
                                }
                            }
                        }
                    }
                },
                "401": { "description": "Não autorizado" },
                "403": { "description": "Acesso negado" },
                "404": { "description": "Usuário não encontrado" },
                "500": { "description": "Erro interno do servidor" }
            }
        }
    },
    "/api/v1/auth/login": {
        "post": {
            "tags": ["Auth"],
            "summary": "Fazer login",
            "description": "Autentica um usuário no sistema",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/AuthLoginRequest"
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Login realizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Login realizado com sucesso" },
                                    "accessToken": { "type": "string" },
                                    "refreshToken": { "type": "string" },
                                    "role": { "type": "string", "enum": ["CUSTOMER", "MARKET_ADMIN"] },
                                    "id": { "type": "string" },
                                    "marketId": { "type": "string", "nullable": true },
                                    "market": {
                                        "type": "object",
                                        "nullable": true,
                                        "properties": {
                                            "id": { "type": "string" },
                                            "name": { "type": "string" },
                                            "address": { "type": "string" },
                                            "profilePicture": { "type": "string", "nullable": true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Credenciais inválidas",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Credenciais inválidas" }
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
    "/api/v1/auth/refresh-token": {
        "post": {
            "tags": ["Auth"],
            "summary": "Renovar token de acesso",
            "description": "Renova o token de acesso usando o refresh token",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "refreshToken": {
                                    "type": "string",
                                    "description": "Token de renovação"
                                }
                            },
                            "required": ["refreshToken"]
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Token renovado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "accessToken": { "type": "string" },
                                    "refreshToken": { "type": "string" },
                                    "role": { "type": "string", "enum": ["CUSTOMER", "MARKET_ADMIN"] },
                                    "marketId": { "type": "string", "nullable": true },
                                    "market": {
                                        "type": "object",
                                        "nullable": true,
                                        "properties": {
                                            "id": { "type": "string" },
                                            "name": { "type": "string" },
                                            "address": { "type": "string" },
                                            "profilePicture": { "type": "string", "nullable": true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "403": {
                    "description": "Refresh token inválido ou expirado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Refresh token inválido ou expirado" }
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
    "/api/v1/auth/logout": {
        "post": {
            "tags": ["Auth"],
            "summary": "Fazer logout",
            "description": "Remove os tokens de autenticação",
            "responses": {
                "200": {
                    "description": "Logout realizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Logout realizado com sucesso" }
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
    "/api/v1/auth/me": {
        "get": {
            "tags": ["Auth"],
            "summary": "Buscar dados do usuário logado",
            "description": "Retorna os dados completos do perfil do usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "responses": {
                "200": {
                    "description": "Dados do usuário retornados com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ProfileResponse"
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
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        },
        "put": {
            "tags": ["Auth"],
            "summary": "Editar perfil completo",
            "description": "Atualiza todos os dados do perfil do usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/ProfileUpdateRequest"
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Perfil atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ProfileResponse"
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
                                    "message": { "type": "string", "example": "Dados inválidos" }
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
                    "description": "Erro interno do servidor"
                }
            }
        },
        "patch": {
            "tags": ["Auth"],
            "summary": "Editar perfil parcialmente",
            "description": "Atualiza apenas os campos especificados do perfil do usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/ProfileUpdateRequest"
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Perfil atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ProfileResponse"
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
                                    "message": { "type": "string", "example": "Dados inválidos" }
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
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/auth/me/upload-picture": {
        "post": {
            "tags": ["Auth"],
            "summary": "Upload de foto de perfil",
            "description": "Faz upload de uma nova foto de perfil para o usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "file": {
                                    "type": "string",
                                    "format": "binary",
                                    "description": "Arquivo de imagem (JPEG, PNG, GIF, WebP - máx 5MB)"
                                }
                            },
                            "required": ["file"]
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Foto de perfil atualizada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Foto de perfil atualizada com sucesso" },
                                    "profilePicture": { "type": "string", "example": "/uploads/profiles/profile_123_1640995200000.jpg" }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Arquivo inválido ou muito grande",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Formato de arquivo não suportado" }
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
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/auth/me/history": {
        "get": {
            "tags": ["Auth"],
            "summary": "Histórico de alterações do perfil",
            "description": "Retorna o histórico de alterações do perfil do usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "responses": {
                "200": {
                    "description": "Histórico retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ProfileHistoryResponse"
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
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/auth/me/request-email-confirmation": {
        "post": {
            "tags": ["Auth"],
            "summary": "Solicitar confirmação de alteração de email",
            "description": "Solicita confirmação para alterar o email do usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/EmailConfirmationRequest"
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Solicitação de confirmação enviada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Email de confirmação enviado para o novo endereço" },
                                    "expiresAt": { "type": "string", "format": "date-time", "example": "2024-01-01T12:00:00.000Z" }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Email inválido ou igual ao atual",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Novo email deve ser diferente do atual" }
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
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/auth/me/confirm-email-change": {
        "post": {
            "tags": ["Auth"],
            "summary": "Confirmar alteração de email",
            "description": "Confirma a alteração de email usando o token enviado por email",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "token": {
                                    "type": "string",
                                    "example": "abc123def456",
                                    "description": "Token de confirmação enviado por email"
                                }
                            },
                            "required": ["token"]
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Email alterado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Email alterado com sucesso" },
                                    "newEmail": { "type": "string", "example": "novo@email.com" }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Token inválido ou expirado",
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
                    "description": "Erro interno do servidor"
                }
            }
        }
    }
};

export const authSchemas = {
    "AuthRegisterUserRequest": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "example": "João Silva",
                "description": "Nome completo do usuário"
            },
            "email": {
                "type": "string",
                "format": "email",
                "example": "joao@email.com",
                "description": "Email do usuário"
            },
            "password": {
                "type": "string",
                "minLength": 6,
                "example": "senha123",
                "description": "Senha do usuário (mínimo 6 caracteres)"
            },
            "phone": {
                "type": "string",
                "example": "+5511999999999",
                "description": "Telefone do usuário (opcional)"
            },
            "profilePicture": {
                "type": "string",
                "example": "https://example.com/foto.jpg",
                "description": "URL da foto de perfil (opcional)"
            },
            "birthDate": {
                "type": "string",
                "format": "date",
                "example": "1990-01-01",
                "description": "Data de nascimento no formato YYYY-MM-DD (opcional)"
            },
            "gender": {
                "type": "string",
                "enum": ["masculino", "feminino", "outro"],
                "example": "masculino",
                "description": "Gênero do usuário (opcional)"
            },
            "address": {
                "type": "string",
                "example": "Rua das Flores, 123",
                "description": "Endereço do usuário (opcional)"
            },
            "marketId": {
                "type": "string",
                "example": "68cb02fa88b3580479e5aac2",
                "description": "ID do mercado para vincular o usuário (opcional)"
            }
        },
        "required": ["name", "email", "password"]
    },
    "AuthCreateMarketRequest": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "example": "Supermercado ABC",
                "description": "Nome do mercado"
            },
            "address": {
                "type": "string",
                "example": "Rua das Flores, 123",
                "description": "Endereço do mercado"
            },
            "profilePicture": {
                "type": "string",
                "example": "https://example.com/logo.jpg",
                "description": "URL da imagem de perfil do mercado"
            }
        },
        "required": ["name", "address"]
    },
    "AuthLinkUserToMarketRequest": {
        "type": "object",
        "properties": {
            "userId": {
                "type": "string",
                "example": "68cb02e988b3580479e5aac1",
                "description": "ID do usuário"
            },
            "marketId": {
                "type": "string",
                "example": "68cb02fa88b3580479e5aac2",
                "description": "ID do mercado"
            }
        },
        "required": ["userId", "marketId"]
    },
    "AuthLoginRequest": {
        "type": "object",
        "properties": {
            "email": {
                "type": "string",
                "format": "email",
                "example": "joao@email.com",
                "description": "Email do usuário"
            },
            "password": {
                "type": "string",
                "example": "senha123",
                "description": "Senha do usuário"
            }
        },
        "required": ["email", "password"]
    },
    "AuthResponse": {
        "type": "object",
        "properties": {
            "accessToken": {
                "type": "string",
                "description": "Token de acesso JWT"
            },
            "refreshToken": {
                "type": "string",
                "description": "Token de renovação JWT"
            },
            "role": {
                "type": "string",
                "enum": ["CUSTOMER", "MARKET_ADMIN"],
                "description": "Papel do usuário no sistema"
            },
            "id": {
                "type": "string",
                "description": "ID do usuário"
            },
            "marketId": {
                "type": "string",
                "nullable": true,
                "description": "ID do mercado (se vinculado)"
            },
            "market": {
                "type": "object",
                "nullable": true,
                "description": "Dados do mercado (se vinculado)",
                "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    "address": { "type": "string" },
                    "profilePicture": { "type": "string", "nullable": true }
                }
            }
        }
    },
    "ProfileResponse": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "example": "68cb02e988b3580479e5aac1",
                "description": "ID do usuário"
            },
            "name": {
                "type": "string",
                "example": "João Silva",
                "description": "Nome completo do usuário"
            },
            "email": {
                "type": "string",
                "format": "email",
                "example": "joao@email.com",
                "description": "Email do usuário"
            },
            "phone": {
                "type": "string",
                "nullable": true,
                "example": "+5511999999999",
                "description": "Telefone do usuário"
            },
            "profilePicture": {
                "type": "string",
                "nullable": true,
                "example": "/uploads/profiles/profile_123_1640995200000.jpg",
                "description": "URL da foto de perfil"
            },
            "birthDate": {
                "type": "string",
                "format": "date-time",
                "nullable": true,
                "example": "1990-01-01T00:00:00.000Z",
                "description": "Data de nascimento"
            },
            "gender": {
                "type": "string",
                "nullable": true,
                "enum": ["masculino", "feminino", "outro"],
                "example": "masculino",
                "description": "Gênero do usuário"
            },
            "address": {
                "type": "string",
                "nullable": true,
                "example": "Rua das Flores, 123",
                "description": "Endereço do usuário"
            },
            "role": {
                "type": "string",
                "enum": ["CUSTOMER", "MARKET_ADMIN"],
                "example": "CUSTOMER",
                "description": "Papel do usuário no sistema"
            },
            "marketId": {
                "type": "string",
                "nullable": true,
                "example": "68cb02fa88b3580479e5aac2",
                "description": "ID do mercado (se vinculado)"
            },
            "market": {
                "type": "object",
                "nullable": true,
                "description": "Dados do mercado (se vinculado)",
                "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    "address": { "type": "string" },
                    "profilePicture": { "type": "string", "nullable": true }
                }
            },
            "createdAt": {
                "type": "string",
                "format": "date-time",
                "example": "2024-01-01T00:00:00.000Z",
                "description": "Data de criação do usuário"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time",
                "example": "2024-01-01T00:00:00.000Z",
                "description": "Data da última atualização"
            }
        }
    },
    "ProfileUpdateRequest": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "minLength": 1,
                "example": "João Silva",
                "description": "Nome completo do usuário"
            },
            "email": {
                "type": "string",
                "format": "email",
                "example": "joao@email.com",
                "description": "Email do usuário"
            },
            "phone": {
                "type": "string",
                "minLength": 10,
                "example": "+5511999999999",
                "description": "Telefone do usuário (mínimo 10 caracteres)"
            },
            "profilePicture": {
                "type": "string",
                "format": "uri",
                "example": "https://example.com/foto.jpg",
                "description": "URL da foto de perfil"
            },
            "birthDate": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
                "example": "1990-01-01",
                "description": "Data de nascimento no formato YYYY-MM-DD"
            },
            "gender": {
                "type": "string",
                "enum": ["masculino", "feminino", "outro"],
                "example": "masculino",
                "description": "Gênero do usuário"
            },
            "address": {
                "type": "string",
                "minLength": 5,
                "example": "Rua das Flores, 123",
                "description": "Endereço do usuário (mínimo 5 caracteres)"
            },
            "password": {
                "type": "string",
                "minLength": 6,
                "example": "senha123",
                "description": "Nova senha (mínimo 6 caracteres)"
            }
        }
    },
    "ProfileHistoryResponse": {
        "type": "object",
        "properties": {
            "history": {
                "type": "array",
                "description": "Lista de alterações do perfil",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "example": "hist_123",
                            "description": "ID da alteração"
                        },
                        "field": {
                            "type": "string",
                            "example": "name",
                            "description": "Campo alterado"
                        },
                        "oldValue": {
                            "type": "string",
                            "nullable": true,
                            "example": "João Santos",
                            "description": "Valor anterior"
                        },
                        "newValue": {
                            "type": "string",
                            "nullable": true,
                            "example": "João Silva",
                            "description": "Novo valor"
                        },
                        "changedAt": {
                            "type": "string",
                            "format": "date-time",
                            "example": "2024-01-01T12:00:00.000Z",
                            "description": "Data da alteração"
                        },
                        "ipAddress": {
                            "type": "string",
                            "example": "192.168.1.1",
                            "description": "Endereço IP da alteração"
                        }
                    }
                }
            },
            "totalChanges": {
                "type": "integer",
                "example": 5,
                "description": "Total de alterações realizadas"
            }
        }
    },
    "EmailConfirmationRequest": {
        "type": "object",
        "properties": {
            "newEmail": {
                "type": "string",
                "format": "email",
                "example": "novo@email.com",
                "description": "Novo endereço de email"
            }
        },
        "required": ["newEmail"]
    }
};

export const authTags = [
    {
        "name": "Auth",
        "description": "Operações de autenticação e autorização"
    }
];
