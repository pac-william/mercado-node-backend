import { categoriesService } from "../services/categoriesService";
import { Logger } from "../utils/logger";

class AiProcessor {
    async process(task: string): Promise<any> {
        Logger.debug('AiProcessor', 'process - Starting AI processing', { task });

        try {
            Logger.debug('AiProcessor', 'process - Fetching categories');
            const categoriesResponse = await categoriesService.getCategories(1, 1000);
            const categories = categoriesResponse.categories.map(c => ({ id: c.id, name: c.name }));

            Logger.debug('AiProcessor', 'process - Categories fetched', {
                totalCategories: categories.length,
                categories: categories.slice(0, 5)
            });

            Logger.debug('AiProcessor', 'process - Making OpenAI API request');
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-4o-2024-08-06",
                    messages: [
                        {
                            role: "system",
                            content: `Você é um agente de mercado criativo e experiente. Gere uma lista ABRANGENTE, VARIADA e CRIATIVA de itens para a tarefa, considerando o contexto e o número de pessoas (ex: para 20 pessoas, sugira itens em escala maior). Gere PELO MENOS 15-20 itens únicos, incluindo variedades típicas (ex: para churrasco, inclua diferentes carnes, acompanhamentos, molhos, saladas, bebidas e utensílios). SOMENTE nomes de itens para pesquisar (sem quantidades/medidas/modo de preparo nos itens individuais). Para cada item, escolha UMA categoria EXISTENTE da lista fornecida. Cada item deve incluir: name, categoryId, categoryName e type, onde type ∈ {essential, common, utensil}. Não duplique itens.

Se a tarefa fizer sentido ter uma receita (ex: fazer um prato, preparar uma comida, receita culinária), gere também um campo receipt com uma receita DETALHADA e COMPLETA, incluindo nome, descrição (com dicas e variações), ingredientes com quantidades ESCALADAS para o número de pessoas na tarefa, instruções de preparo (passos detalhados), prepTime (tempo de preparo em minutos), cookTime (tempo de cozimento em minutos, opcional) e servings (número de porções). Retorne EXCLUSIVAMENTE no formato solicitado em JSON.`
                        },
                        {
                            role: "user",
                            content: `Categorias disponíveis (use APENAS uma destas por item): ${JSON.stringify(categories, null, 2)}.\nAgora, gere uma lista única e variada de itens para realizar a tarefa: ${task}. Não separe em seções. Para cada item gere: name (string), categoryId (um dos ids acima), categoryName (nome correspondente), type ("essential" | "common" | "utensil"). Não inclua quantidades, medidas ou modo de preparo nos itens.\n\nIMPORTANTE: Se a tarefa "${task}" fizer sentido ter uma receita (ex: fazer um prato, preparar uma comida, receita culinária), gere também um campo receipt opcional no objeto raiz com: name (nome da receita), description (descrição breve com dicas), ingredients (array de objetos com name e quantity escalada para o número de pessoas), instructions (array de strings com passos detalhados), prepTime (tempo de preparo em minutos), cookTime (tempo de cozimento em minutos, opcional), servings (número de porções). Se a tarefa não fizer sentido ter receita (ex: comprar produtos básicos, fazer limpeza), não inclua o campo receipt.`
                        }
                    ],
                    response_format: {
                        type: "json_schema",
                        json_schema: {
                            name: "suggestion_schema",
                            schema: {
                                type: "object",
                                properties: {
                                    items: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                name: { type: "string" },
                                                categoryId: { type: "string" },
                                                categoryName: { type: "string" },
                                                type: { type: "string", enum: ["essential", "common", "utensil"] }
                                            },
                                            required: ["name", "categoryId", "categoryName", "type"],
                                            additionalProperties: false
                                        }
                                    },
                                    receipt: {
                                        type: "object",
                                        properties: {
                                            name: { type: "string" },
                                            description: { type: "string" },
                                            ingredients: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        name: { type: "string" },
                                                        quantity: { type: "string" }
                                                    },
                                                    required: ["name", "quantity"],
                                                    additionalProperties: false
                                                }
                                            },
                                            instructions: {
                                                type: "array",
                                                items: { type: "string" }
                                            },
                                            prepTime: { type: "number" },
                                            cookTime: { type: "number" },
                                            servings: { type: "number" }
                                        },
                                        required: ["name", "description", "ingredients", "instructions", "prepTime", "cookTime", "servings"],
                                        additionalProperties: false
                                    }
                                },
                                required: ["items"],
                                additionalProperties: false
                            },
                            strict: false
                        }
                    }
                })
            });

            Logger.debug('AiProcessor', 'process - OpenAI API response received', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                const errorText = await response.text();
                Logger.error('AiProcessor', 'process - OpenAI API error', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText
                });
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json() as any;
            Logger.debug('AiProcessor', 'process - OpenAI response parsed', {
                hasChoices: !!data.choices,
                contentLength: data.choices?.[0]?.message?.content?.length || 0
            });

            const outputData = JSON.parse(data.choices[0].message.content) as {
                items: Array<{ name: string; categoryId: string; categoryName: string; type: "essential" | "common" | "utensil" }>;
                receipt?: {
                    name: string;
                    description: string;
                    ingredients: Array<{ name: string; quantity: string }>;
                    instructions: string[];
                    prepTime: number;
                    cookTime?: number;
                    servings: number;
                };
            };

            outputData.items = outputData.items.filter(item => {
                const validCategory = categories.find(c => c.id === item.categoryId && c.name === item.categoryName);
                if (!validCategory) {
                    Logger.warn('AiProcessor', 'process - Invalid category in item', { item });
                    return false;
                }
                return true;
            });

            Logger.debug('AiProcessor', 'process - AI suggestion parsed', {
                totalItems: outputData.items?.length || 0,
                hasReceipt: !!outputData.receipt
            });

            const finalSuggestion: {
                items: Array<{ name: string; categoryId: string; categoryName: string; type: "essential" | "common" | "utensil" }>;
                receipt?: {
                    name: string;
                    description: string;
                    ingredients: Array<{ name: string; quantity: string }>;
                    instructions: string[];
                    prepTime: number;
                    cookTime?: number;
                    servings: number;
                };
            } = {
                items: outputData.items
            };

            if (outputData.receipt) {
                finalSuggestion.receipt = outputData.receipt;
            }

            Logger.debug('AiProcessor', 'process - Processing completed successfully', {
                totalItems: finalSuggestion.items.length,
                hasReceipt: !!finalSuggestion.receipt
            });

            return finalSuggestion;

        } catch (error: any) {
            Logger.error('AiProcessor', 'process - Error during AI processing', {
                message: error.message,
                stack: error.stack,
                name: error.name,
                task
            });
            throw error;
        }
    }
}

export default new AiProcessor();