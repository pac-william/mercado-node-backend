export const addressPaths = {
    "/api/v1/addresses": {
        "get": {
            "tags": ["Addresses"],
            "summary": "Listar endereços do usuário",
            "description": "Retorna uma lista paginada de endereços do usuário autenticado",
            "security": [{ "bearerAuth": [] }],
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
                    "description": "Lista de endereços retornada com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/AddressListResponse" }
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
        },
        "post": {
            "tags": ["Addresses"],
            "summary": "Criar novo endereço",
            "description": "Cria um novo endereço para o usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/AddressCreateRequest" }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Endereço criado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/AddressResponse" }
                        }
                    }
                },
                "400": {
                    "description": "Dados inválidos ou limite de endereços excedido",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Limite máximo de 3 endereços por usuário" }
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
    "/api/v1/addresses/{id}": {
        "get": {
            "tags": ["Addresses"],
            "summary": "Buscar endereço por ID",
            "description": "Retorna um endereço específico do usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID do endereço"
                }
            ],
            "responses": {
                "200": {
                    "description": "Endereço retornado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/AddressResponse" }
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
                    "description": "Endereço não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Endereço não encontrado" }
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
            "tags": ["Addresses"],
            "summary": "Atualizar endereço completo",
            "description": "Atualiza todos os dados de um endereço do usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID do endereço"
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/AddressCreateRequest" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Endereço atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/AddressResponse" }
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
                    "description": "Endereço não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Endereço não encontrado" }
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
            "tags": ["Addresses"],
            "summary": "Atualizar endereço parcialmente",
            "description": "Atualiza apenas os campos especificados de um endereço do usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID do endereço"
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": { "$ref": "#/components/schemas/AddressUpdateRequest" }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Endereço atualizado com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/AddressResponse" }
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
                    "description": "Endereço não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Endereço não encontrado" }
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
            "tags": ["Addresses"],
            "summary": "Excluir endereço",
            "description": "Remove um endereço do usuário autenticado",
            "security": [{ "bearerAuth": [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "schema": { "type": "string" },
                    "description": "ID do endereço"
                }
            ],
            "responses": {
                "200": {
                    "description": "Endereço excluído com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/AddressResponse" }
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
                    "description": "Endereço não encontrado",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": { "type": "string", "example": "Endereço não encontrado" }
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

export const addressSchemas = {
    "AddressResponse": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "example": "507f1f77bcf86cd799439011",
                "description": "ID único do endereço"
            },
            "userId": {
                "type": "string",
                "example": "507f1f77bcf86cd799439012",
                "description": "ID do usuário proprietário"
            },
            "name": {
                "type": "string",
                "example": "Casa",
                "description": "Nome do endereço"
            },
            "street": {
                "type": "string",
                "example": "Rua das Flores",
                "description": "Nome da rua"
            },
            "number": {
                "type": "string",
                "example": "123",
                "description": "Número do endereço"
            },
            "complement": {
                "type": "string",
                "nullable": true,
                "example": "Apto 45",
                "description": "Complemento do endereço"
            },
            "neighborhood": {
                "type": "string",
                "example": "Centro",
                "description": "Bairro"
            },
            "city": {
                "type": "string",
                "example": "São Paulo",
                "description": "Cidade"
            },
            "state": {
                "type": "string",
                "example": "SP",
                "description": "Estado"
            },
            "zipCode": {
                "type": "string",
                "example": "01234-567",
                "description": "CEP"
            },
            "isFavorite": {
                "type": "boolean",
                "example": true,
                "description": "Se é o endereço favorito"
            },
            "isActive": {
                "type": "boolean",
                "example": true,
                "description": "Se o endereço está ativo"
            },
            "latitude": {
                "type": "number",
                "example": -23.55052,
                "description": "Latitude do endereço",
                "nullable": true
            },
            "longitude": {
                "type": "number",
                "example": -46.633308,
                "description": "Longitude do endereço",
                "nullable": true
            },
            "createdAt": {
                "type": "string",
                "format": "date-time",
                "example": "2024-01-01T00:00:00.000Z",
                "description": "Data de criação"
            },
            "updatedAt": {
                "type": "string",
                "format": "date-time",
                "example": "2024-01-01T00:00:00.000Z",
                "description": "Data da última atualização"
            }
        }
    },
    "AddressCreateRequest": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "example": "Casa",
                "description": "Nome do endereço",
                "minLength": 1
            },
            "street": {
                "type": "string",
                "example": "Rua das Flores",
                "description": "Nome da rua",
                "minLength": 3
            },
            "number": {
                "type": "string",
                "example": "123",
                "description": "Número do endereço",
                "minLength": 1
            },
            "complement": {
                "type": "string",
                "example": "Apto 45",
                "description": "Complemento do endereço"
            },
            "neighborhood": {
                "type": "string",
                "example": "Centro",
                "description": "Bairro",
                "minLength": 2
            },
            "city": {
                "type": "string",
                "example": "São Paulo",
                "description": "Cidade",
                "minLength": 2
            },
            "state": {
                "type": "string",
                "example": "SP",
                "description": "Estado",
                "minLength": 2
            },
            "zipCode": {
                "type": "string",
                "example": "01234-567",
                "description": "CEP no formato brasileiro",
                "pattern": "^\\d{5}-?\\d{3}$"
            },
            "isFavorite": {
                "type": "boolean",
                "example": false,
                "description": "Se é o endereço favorito",
                "default": false
            },
            "latitude": {
                "type": "number",
                "example": -23.55052,
                "description": "Latitude do endereço (opcional)",
                "nullable": true
            },
            "longitude": {
                "type": "number",
                "example": -46.633308,
                "description": "Longitude do endereço (opcional)",
                "nullable": true
            }
        },
        "required": ["name", "street", "number", "neighborhood", "city", "state", "zipCode"]
    },
    "AddressUpdateRequest": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "example": "Casa Atualizada",
                "description": "Nome do endereço",
                "minLength": 1
            },
            "street": {
                "type": "string",
                "example": "Rua das Flores",
                "description": "Nome da rua",
                "minLength": 3
            },
            "number": {
                "type": "string",
                "example": "123",
                "description": "Número do endereço",
                "minLength": 1
            },
            "complement": {
                "type": "string",
                "example": "Apto 45",
                "description": "Complemento do endereço"
            },
            "neighborhood": {
                "type": "string",
                "example": "Centro",
                "description": "Bairro",
                "minLength": 2
            },
            "city": {
                "type": "string",
                "example": "São Paulo",
                "description": "Cidade",
                "minLength": 2
            },
            "state": {
                "type": "string",
                "example": "SP",
                "description": "Estado",
                "minLength": 2
            },
            "zipCode": {
                "type": "string",
                "example": "01234-567",
                "description": "CEP no formato brasileiro",
                "pattern": "^\\d{5}-?\\d{3}$"
            },
            "isFavorite": {
                "type": "boolean",
                "example": true,
                "description": "Se é o endereço favorito"
            },
            "isActive": {
                "type": "boolean",
                "example": true,
                "description": "Se o endereço está ativo"
            },
            "latitude": {
                "type": "number",
                "example": -23.55052,
                "description": "Latitude do endereço (opcional)",
                "nullable": true
            },
            "longitude": {
                "type": "number",
                "example": -46.633308,
                "description": "Longitude do endereço (opcional)",
                "nullable": true
            }
        }
    },
    "AddressListResponse": {
        "type": "object",
        "properties": {
            "addresses": {
                "type": "array",
                "items": { "$ref": "#/components/schemas/AddressResponse" },
                "description": "Lista de endereços"
            },
            "meta": {
                "type": "object",
                "properties": {
                    "page": {
                        "type": "integer",
                        "example": 1,
                        "description": "Número da página atual"
                    },
                    "size": {
                        "type": "integer",
                        "example": 10,
                        "description": "Tamanho da página"
                    },
                    "total": {
                        "type": "integer",
                        "example": 3,
                        "description": "Total de endereços retornados na página"
                    },
                    "totalPages": {
                        "type": "integer",
                        "example": 1,
                        "description": "Quantidade de páginas disponíveis"
                    },
                    "totalItems": {
                        "type": "integer",
                        "example": 3,
                        "description": "Total de endereços cadastrados para o usuário"
                    }
                }
            }
        }
    }
};

export const addressTags = [
    {
        "name": "Addresses",
        "description": "Operações relacionadas a endereços de usuários"
    }
];
