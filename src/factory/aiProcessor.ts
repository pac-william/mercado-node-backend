// Removed strict typing imports to allow new unified structure without changing interfaces
// import { AISuggestionResponse, SuggestionResponse } from "../interfaces/suggestionInterface";
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
                categories: categories.slice(0, 5) // Log apenas as primeiras 5 para não poluir
            });

            Logger.debug('AiProcessor', 'process - Making OpenAI API request');
            const response = await fetch("https://api.openai.com/v1/responses", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-4o-2024-08-06",
                    input: [
                        {
                            role: "system",
                            content: "Você é um agente de mercado. Gere SOMENTE nomes de itens para pesquisar (sem quantidades/medidas/modo de preparo). Para cada item, escolha UMA categoria EXISTENTE da lista fornecida. Cada item deve incluir: name, categoryId, categoryName e type, onde type ∈ {essential, common, utensil}. Retorne EXCLUSIVAMENTE no formato solicitado."
                        },
                        {
                            role: "user",
                            content: `Categorias disponíveis (use APENAS uma destas por item): ${JSON.stringify(categories, null, 2)}.\nAgora, gere uma lista única de itens para realizar a tarefa: ${task}. Não separe em seções. Para cada item gere: name (string), categoryId (um dos ids acima), categoryName (nome correspondente), type ("essential" | "common" | "utensil"). Não inclua quantidades, medidas ou modo de preparo.`
                        }
                    ],
                    text: {
                        format: {
                            type: "json_schema",
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
                                    }
                                },
                                required: ["items"],
                                additionalProperties: false
                            },
                            strict: true
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
                hasOutput: !!data.output,
                outputLength: data.output?.length || 0 
            });

            const outputData = JSON.parse(data.output[0].content[0].text) as { items: Array<{ name: string; categoryId: string; categoryName: string; type: "essential" | "common" | "utensil" }> };
            Logger.debug('AiProcessor', 'process - AI suggestion parsed', { 
                totalItems: outputData.items?.length || 0
            });

            const finalSuggestion = {
                items: outputData.items
            };

            Logger.debug('AiProcessor', 'process - Processing completed successfully', { 
                totalItems: finalSuggestion.items.length
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