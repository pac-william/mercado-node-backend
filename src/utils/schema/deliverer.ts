export const delivererPaths = {
    "/api/v1/deliverers": {
        "get": {
            "tags": ["Deliverers"],
            "summary": "Listar entregadores",
            "description": "Retorna uma lista paginada de entregadores com filtros opcionais.",
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
                    "name": "status",
                    "in": "query",
                    "description": "Status do entregador (ACTIVE/INACTIVE)",
                    "required": false,
                    "schema": { "type": "string", "enum": ["ACTIVE", "INACTIVE"] }
                }
            ],
            "responses": {
                "200": {
                    "description": "Lista de entregadores retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/DelivererPaginatedResponse" }
                        }
                    }
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        },
        "post": {
            "tags": ["Deliverers"],
            "summary": "Cadastrar entregador",
            "description": "Cria um novo entregador no sistema.",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/DelivererDTO" }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Entregador criado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Deliverer" }
                        }
                    }
                },
                "400": {
                    "description": "Erro de validação"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    },
    "/api/v1/deliverers/active": {
        "get": {
            "tags": ["Deliverers"],
            "summary": "Listar entregadores ativos",
            "description": "Retorna uma lista de todos os entregadores ativos.",
            "responses": {
                "200": {
                    "description": "Lista de entregadores ativos retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "deliverers": {
                                        "type": "array",
                                        "items": { "$ref": "#/components/schemas/Deliverer" }
                                    }
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
    "/api/v1/deliverers/{id}": {
        "get": {
            "tags": ["Deliverers"],
            "summary": "Buscar entregador por ID",
            "description": "Retorna um entregador específico pelo ID.",
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
                    "description": "Entregador retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Deliverer" }
                        }
                    }
                },
                "404": {
                    "description": "Entregador não encontrado"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        },
        "put": {
            "tags": ["Deliverers"],
            "summary": "Atualizar entregador",
            "description": "Atualiza completamente um entregador existente.",
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
                        "schema": { "$ref": "#/components/schemas/DelivererDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Entregador atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Deliverer" }
                        }
                    }
                },
                "400": {
                    "description": "Erro de validação"
                },
                "404": {
                    "description": "Entregador não encontrado"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        },
        "patch": {
            "tags": ["Deliverers"],
            "summary": "Atualizar parcialmente entregador",
            "description": "Atualiza parcialmente um entregador existente.",
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
                        "schema": { "$ref": "#/components/schemas/DelivererUpdateDTO" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Entregador atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Deliverer" }
                        }
                    }
                },
                "400": {
                    "description": "Erro de validação"
                },
                "404": {
                    "description": "Entregador não encontrado"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        },
        "delete": {
            "tags": ["Deliverers"],
            "summary": "Desativar entregador",
            "description": "Desativa um entregador (muda status para INACTIVE).",
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
                    "description": "Entregador desativado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Deliverer" }
                        }
                    }
                },
                "404": {
                    "description": "Entregador não encontrado"
                },
                "500": {
                    "description": "Erro interno do servidor"
                }
            }
        }
    }
};

export const delivererSchemas = {
    "Deliverer": {
        "type": "object",
        "properties": {
            "id": { "type": "string", "example": "507f1f77bcf86cd799439011" },
            "name": { "type": "string", "example": "João Silva" },
            "document": { "type": "string", "example": "12345678901" },
            "phone": { "type": "string", "example": "(11) 99999-9999" },
            "status": { "type": "string", "enum": ["ACTIVE", "INACTIVE"], "example": "ACTIVE" },
            "vehicle": {
                "type": "object",
                "properties": {
                    "type": { "type": "string", "enum": ["bicicleta", "moto", "carro"], "example": "moto" },
                    "plate": { "type": "string", "example": "ABC-1234" },
                    "description": { "type": "string", "example": "Honda CG 160" }
                }
            },
            "createdAt": { "type": "string", "format": "date-time" },
            "updatedAt": { "type": "string", "format": "date-time" }
        }
    },
    "DelivererDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "example": "João Silva" },
            "document": { "type": "string", "example": "12345678901" },
            "phone": { "type": "string", "example": "(11) 99999-9999" },
            "status": { "type": "string", "enum": ["ACTIVE", "INACTIVE"], "default": "ACTIVE" },
            "vehicle": {
                "type": "object",
                "properties": {
                    "type": { "type": "string", "enum": ["bicicleta", "moto", "carro"], "example": "moto" },
                    "plate": { "type": "string", "example": "ABC-1234" },
                    "description": { "type": "string", "example": "Honda CG 160" }
                },
                "required": ["type"]
            }
        },
        "required": ["name", "document", "phone", "vehicle"]
    },
    "DelivererUpdateDTO": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "example": "João Silva" },
            "document": { "type": "string", "example": "12345678901" },
            "phone": { "type": "string", "example": "(11) 99999-9999" },
            "status": { "type": "string", "enum": ["ACTIVE", "INACTIVE"] },
            "vehicle": {
                "type": "object",
                "properties": {
                    "type": { "type": "string", "enum": ["bicicleta", "moto", "carro"] },
                    "plate": { "type": "string" },
                    "description": { "type": "string" }
                }
            }
        }
    },
    "DelivererPaginatedResponse": {
        "type": "object",
        "properties": {
            "deliverers": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/Deliverer" }
            },
            "meta": { "$ref": "#/components/schemas/Meta" }
        }
    }
};

export const delivererTags = [
    {
        "name": "Deliverers",
        "description": "Operações relacionadas a entregadores"
    }
];
