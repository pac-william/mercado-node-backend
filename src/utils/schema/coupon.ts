export const couponTags = [
    {
        name: 'Coupons',
        description: 'Operações relacionadas a cupons de desconto'
    }
];

export const couponSchemas = {
    CouponDTO: {
        type: 'object',
        required: ['code', 'name', 'type', 'value'],
        properties: {
            code: {
                type: 'string',
                description: 'Código do cupom',
                example: 'DESCONTO10'
            },
            name: {
                type: 'string',
                description: 'Nome do cupom',
                example: 'Desconto de 10%'
            },
            description: {
                type: 'string',
                description: 'Descrição do cupom',
                example: 'Desconto de 10% em compras acima de R$ 50,00'
            },
            type: {
                type: 'string',
                enum: ['PERCENTAGE', 'FIXED'],
                description: 'Tipo do desconto',
                example: 'PERCENTAGE'
            },
            value: {
                type: 'number',
                description: 'Valor do desconto',
                example: 10
            },
            minOrderValue: {
                type: 'number',
                description: 'Valor mínimo do pedido para usar o cupom',
                example: 50.00
            },
            maxDiscount: {
                type: 'number',
                description: 'Desconto máximo (para cupons percentuais)',
                example: 20.00
            },
            usageLimit: {
                type: 'number',
                description: 'Limite de uso do cupom',
                example: 100
            },
            isActive: {
                type: 'boolean',
                description: 'Se o cupom está ativo',
                example: true
            },
            validFrom: {
                type: 'string',
                format: 'date-time',
                description: 'Data de início da validade',
                example: '2024-01-01T00:00:00.000Z'
            },
            validUntil: {
                type: 'string',
                format: 'date-time',
                description: 'Data de fim da validade',
                example: '2024-12-31T23:59:59.000Z'
            },
            marketId: {
                type: 'string',
                description: 'ID do mercado',
                example: '507f1f77bcf86cd799439011'
            }
        }
    },
    CouponUpdateDTO: {
        type: 'object',
        properties: {
            code: {
                type: 'string',
                description: 'Código do cupom',
                example: 'DESCONTO10'
            },
            name: {
                type: 'string',
                description: 'Nome do cupom',
                example: 'Desconto de 10%'
            },
            description: {
                type: 'string',
                description: 'Descrição do cupom',
                example: 'Desconto de 10% em compras acima de R$ 50,00'
            },
            type: {
                type: 'string',
                enum: ['PERCENTAGE', 'FIXED'],
                description: 'Tipo do desconto',
                example: 'PERCENTAGE'
            },
            value: {
                type: 'number',
                description: 'Valor do desconto',
                example: 10
            },
            minOrderValue: {
                type: 'number',
                description: 'Valor mínimo do pedido para usar o cupom',
                example: 50.00
            },
            maxDiscount: {
                type: 'number',
                description: 'Desconto máximo (para cupons percentuais)',
                example: 20.00
            },
            usageLimit: {
                type: 'number',
                description: 'Limite de uso do cupom',
                example: 100
            },
            isActive: {
                type: 'boolean',
                description: 'Se o cupom está ativo',
                example: true
            },
            validFrom: {
                type: 'string',
                format: 'date-time',
                description: 'Data de início da validade',
                example: '2024-01-01T00:00:00.000Z'
            },
            validUntil: {
                type: 'string',
                format: 'date-time',
                description: 'Data de fim da validade',
                example: '2024-12-31T23:59:59.000Z'
            },
            marketId: {
                type: 'string',
                description: 'ID do mercado',
                example: '507f1f77bcf86cd799439011'
            }
        }
    },
    CouponResponseDTO: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'ID do cupom',
                example: '507f1f77bcf86cd799439011'
            },
            code: {
                type: 'string',
                description: 'Código do cupom',
                example: 'DESCONTO10'
            },
            name: {
                type: 'string',
                description: 'Nome do cupom',
                example: 'Desconto de 10%'
            },
            description: {
                type: 'string',
                description: 'Descrição do cupom',
                example: 'Desconto de 10% em compras acima de R$ 50,00'
            },
            type: {
                type: 'string',
                enum: ['PERCENTAGE', 'FIXED'],
                description: 'Tipo do desconto',
                example: 'PERCENTAGE'
            },
            value: {
                type: 'number',
                description: 'Valor do desconto',
                example: 10
            },
            minOrderValue: {
                type: 'number',
                description: 'Valor mínimo do pedido para usar o cupom',
                example: 50.00
            },
            maxDiscount: {
                type: 'number',
                description: 'Desconto máximo (para cupons percentuais)',
                example: 20.00
            },
            usageLimit: {
                type: 'number',
                description: 'Limite de uso do cupom',
                example: 100
            },
            usedCount: {
                type: 'number',
                description: 'Quantidade de vezes que o cupom foi usado',
                example: 25
            },
            isActive: {
                type: 'boolean',
                description: 'Se o cupom está ativo',
                example: true
            },
            validFrom: {
                type: 'string',
                format: 'date-time',
                description: 'Data de início da validade',
                example: '2024-01-01T00:00:00.000Z'
            },
            validUntil: {
                type: 'string',
                format: 'date-time',
                description: 'Data de fim da validade',
                example: '2024-12-31T23:59:59.000Z'
            },
            marketId: {
                type: 'string',
                description: 'ID do mercado',
                example: '507f1f77bcf86cd799439011'
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Data de criação',
                example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Data de atualização',
                example: '2024-01-01T00:00:00.000Z'
            }
        }
    },
    CouponPaginatedResponse: {
        type: 'object',
        properties: {
            coupons: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/CouponResponseDTO'
                }
            },
            meta: {
                $ref: '#/components/schemas/Meta'
            }
        }
    }
};

export const couponPaths = {
    '/api/v1/coupons': {
        get: {
            tags: ['Coupons'],
            summary: 'Listar cupons',
            description: 'Retorna uma lista paginada de cupons',
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'Número da página',
                    required: false,
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        default: 1
                    }
                },
                {
                    name: 'size',
                    in: 'query',
                    description: 'Tamanho da página',
                    required: false,
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 100,
                        default: 10
                    }
                },
                {
                    name: 'marketId',
                    in: 'query',
                    description: 'ID do mercado para filtrar cupons',
                    required: false,
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'isActive',
                    in: 'query',
                    description: 'Filtrar por cupons ativos',
                    required: false,
                    schema: {
                        type: 'boolean'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Lista de cupons retornada com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CouponPaginatedResponse'
                            }
                        }
                    }
                },
                500: {
                    description: 'Erro interno do servidor'
                }
            }
        },
        post: {
            tags: ['Coupons'],
            summary: 'Criar cupom',
            description: 'Cria um novo cupom de desconto',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CouponDTO'
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Cupom criado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CouponResponseDTO'
                            }
                        }
                    }
                },
                400: {
                    description: 'Dados inválidos'
                },
                500: {
                    description: 'Erro interno do servidor'
                }
            }
        }
    },
    '/api/v1/coupons/{id}': {
        get: {
            tags: ['Coupons'],
            summary: 'Buscar cupom por ID',
            description: 'Retorna um cupom específico pelo ID',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID do cupom',
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Cupom encontrado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CouponResponseDTO'
                            }
                        }
                    }
                },
                404: {
                    description: 'Cupom não encontrado'
                },
                500: {
                    description: 'Erro interno do servidor'
                }
            }
        },
        put: {
            tags: ['Coupons'],
            summary: 'Atualizar cupom',
            description: 'Atualiza um cupom existente',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID do cupom',
                    schema: {
                        type: 'string'
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CouponDTO'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Cupom atualizado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CouponResponseDTO'
                            }
                        }
                    }
                },
                400: {
                    description: 'Dados inválidos'
                },
                404: {
                    description: 'Cupom não encontrado'
                },
                500: {
                    description: 'Erro interno do servidor'
                }
            }
        },
        patch: {
            tags: ['Coupons'],
            summary: 'Atualizar cupom parcialmente',
            description: 'Atualiza parcialmente um cupom existente',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID do cupom',
                    schema: {
                        type: 'string'
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CouponUpdateDTO'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Cupom atualizado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CouponResponseDTO'
                            }
                        }
                    }
                },
                400: {
                    description: 'Dados inválidos'
                },
                404: {
                    description: 'Cupom não encontrado'
                },
                500: {
                    description: 'Erro interno do servidor'
                }
            }
        },
        delete: {
            tags: ['Coupons'],
            summary: 'Deletar cupom',
            description: 'Remove um cupom do sistema',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID do cupom',
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Cupom deletado com sucesso'
                },
                404: {
                    description: 'Cupom não encontrado'
                },
                500: {
                    description: 'Erro interno do servidor'
                }
            }
        }
    }
};