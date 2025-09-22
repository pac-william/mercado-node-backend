import { AISuggestionResponse, SuggestionResponse } from "../interfaces/suggestionInterface";
import { productElasticSearch } from "../rest/productElasticSearch";

class AiProcessor {
    async process(): Promise<SuggestionResponse> {
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
                        content: "Você é um assistente de culinária que lista apenas os nomes de produtos e utensílios necessários, sem medidas ou instruções de preparo."
                    },
                    {
                        role: "user",
                        content: "Liste apenas os produtos e utensílios necessários para fazer um pudim de leite condensado, separando em essential_products, common_products e utensils. Não inclua quantidades, medidas ou modo de preparo."
                    }
                ],
                text: {
                    format: {
                        type: "json_schema",
                        name: "pudim_schema",
                        schema: {
                            type: "object",
                            properties: {
                                essential_products: {
                                    type: "array",
                                    items: { type: "string" }
                                },
                                common_products: {
                                    type: "array",
                                    items: { type: "string" }
                                },
                                utensils: {
                                    type: "array",
                                    items: { type: "string" }
                                }
                            },
                            required: ["essential_products", "common_products", "utensils"],
                            additionalProperties: false
                        },
                        strict: true
                    }
                }
            })
        });

        const data = await response.json() as AISuggestionResponse;

        const outputData: SuggestionResponse = JSON.parse(data.output[0].content[0].text) as SuggestionResponse;

        const finalSuggestion: SuggestionResponse = {
            essential_products: outputData.essential_products,
            common_products: outputData.common_products,
            utensils: outputData.utensils
        };

        // Concatena todos os itens em um array único
        const allItems = [
            ...outputData.essential_products,
            ...outputData.common_products,
            ...outputData.utensils
        ];

        // Faz loop em todos os itens e busca produtos
        const searchPromises = allItems.map(item =>
            productElasticSearch.getProducts(item, 1, 100)
        );

        // Aguarda todas as buscas e concatena os resultados
        const searchResults = await Promise.all(searchPromises);
        
        // Agrupa produtos por termo de busca original
        const productsBySearchTerm = allItems.map((searchTerm, index) => ({
            searchTerm,
            products: searchResults[index]?.products || [],
            meta: searchResults[index]?.meta || { total: 0, page: 1, size: 100 }
        }));
        
        // Calcula estatísticas gerais
        const totalProductsFound = searchResults.reduce((total, result) => 
            total + (result.products?.length || 0), 0
        );

        return {
            ...finalSuggestion,
            searchResults: {
                productsBySearchTerm,
                statistics: {
                    totalSearches: allItems.length,
                    totalProductsFound,
                    searchTerms: allItems
                }
            }
        };
    }
}

export default new AiProcessor();