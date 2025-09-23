export const suggestionPaths = {
    "/api/v1/suggestions": {
        "get": {
            "tags": ["Suggestions"],
            "summary": "Obter sugestões de produtos",
            "description": "Retorna sugestões de produtos essenciais, produtos comuns e utensílios baseados em IA.",
            "security": [{ "BearerAuth": [] }],
            "parameters": [
                {
                    "name": "task",
                    "in": "query",
                    "required": true,
                    "description": "Tarefa a ser realizada. Exemplo: quero fazer um pudim de leite",
                    "schema": {
                        "type": "string",
                        "example": "Quero fazer um pudim de leite"
                    }
                }
            ],
            "responses": {
                "201": {
                    "description": "Sugestões retornadas com sucesso",
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/SuggestionResponse" }
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
    "SuggestionResponse": {
        "type": "object",
        "properties": {
            "essential_products": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Lista de produtos essenciais para a receita",
                "example": ["leite condensado", "leite", "ovos", "açúcar"]
            },
            "common_products": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Lista de produtos comuns para a receita",
                "example": ["essência de baunilha", "água"]
            },
            "utensils": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Lista de utensílios necessários para a receita",
                "example": ["forma de pudim", "panela", "colher", "liquidificador", "fogão", "geladeira"]
            }
        },
        "required": ["essential_products", "common_products", "utensils"],
        "additionalProperties": false
    }
};

export const suggestionTags = [
    {   
        "name": "Suggestions",
        "description": "Operações relacionadas a sugestões"
    }
];
