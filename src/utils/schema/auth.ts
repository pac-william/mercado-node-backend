export const authPaths = {
    "/api/v1/auth/signup": {
        "post": {
            "tags": ["Auth"],
            "summary": "Registrar usuário no Auth0",
            "description": "Registra um novo usuário no Auth0 através da API Management.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Auth0CreateUserRequest"
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Usuário registrado com sucesso no Auth0",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/CreateUserResponse"
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
    "/api/v1/auth/signin": {
        "post": {
            "tags": ["Auth"],
            "summary": "Fazer login no Auth0",
            "description": "Autentica um usuário no Auth0 usando password realm.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Auth0LoginRequest"
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
                                "$ref": "#/components/schemas/GetTokenResponse"
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
    }
};

export const authSchemas = {
    "Auth0CreateUserRequest": {
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
                "minLength": 6,
                "example": "senha123",
                "description": "Senha do usuário (mínimo 6 caracteres)"
            },
            "name": {
                "type": "string",
                "example": "João Silva",
                "description": "Nome completo do usuário"
            }
        },
        "required": ["email", "password", "name"]
    },
    "Auth0LoginRequest": {
        "type": "object",
        "properties": {
            "username": {
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
        "required": ["username", "password"]
    },
    "CreateUserResponse": {
        "type": "object",
        "properties": {
            "created_at": {
                "type": "string",
                "format": "date-time",
                "description": "Data de criação"
            },
            "email": {
                "type": "string",
                "format": "email",
                "description": "Email do usuário"
            },
            "email_verified": {
                "type": "boolean",
                "description": "Email verificado"
            },
            "identities": {
                "type": "array",
                "items": {
                    "$ref": "#/components/schemas/Identity"
                }
            },
            "name": {
                "type": "string",
                "description": "Nome do usuário"
            },
            "nickname": {
                "type": "string",
                "description": "Apelido"
            },
            "picture": {
                "type": "string",
                "description": "URL da foto"
            },
            "updated_at": {
                "type": "string",
                "format": "date-time",
                "description": "Data de atualização"
            },
            "user_id": {
                "type": "string",
                "description": "ID do usuário no Auth0"
            }
        }
    },
    "Identity": {
        "type": "object",
        "properties": {
            "user_id": {
                "type": "string",
                "description": "ID do usuário"
            },
            "provider": {
                "type": "string",
                "description": "Provedor de autenticação"
            },
            "isSocial": {
                "type": "boolean",
                "description": "Indica se é login social"
            }
        }
    },
    "GetTokenResponse": {
        "type": "object",
        "properties": {
            "access_token": {
                "type": "string",
                "description": "Token de acesso"
            },
            "expires_in": {
                "type": "number",
                "description": "Tempo de expiração em segundos"
            },
            "token_type": {
                "type": "string",
                "description": "Tipo do token"
            },
            "scope": {
                "type": "string",
                "description": "Escopos do token"
            },
            "id_token": {
                "type": "string",
                "description": "ID token"
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