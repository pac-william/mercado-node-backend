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
    }
};

export const authTags = [
    {
        "name": "Auth",
        "description": "Operações de autenticação e autorização"
    }
];
