import { AISuggestionResponse, SuggestionResponse } from "../interfaces/suggestionInterface";
import { productElasticSearch } from "../rest/productElasticSearch";
import { categoriesService } from "../services/categoriesService";

class AiProcessor {
    async process(task: string): Promise<SuggestionResponse> {

        const categoriesResponse = await categoriesService.getCategories(1, 1000);
        const categories = categoriesResponse.categories.map(c => ({ id: c.id, name: c.name }));

        console.log(JSON.stringify(categories, null, 2));

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
                        content: "Você é um agente de mercado, você gerencia o estoque de um mercado e irá ajudar o usuário a encontrar os produtos para a tarefa que ele irá te passar. Sua tarefa: gerar nomes de produtos e utensílios necessários (sem quantidades/mode de preparo) e, PARA CADA ITEM, escolher uma categoria EXISTENTE da lista fornecida seja consistente com qual categoria representa melhor o produto. Retorne somente no formato solicitado."
                    },
                    {
                        role: "user",
                        content: `Categorias disponíveis (use APENAS uma destas por item): ${JSON.stringify(categories, null, 2)}.\nAgora, liste itens para realizar a tarefa solicitada: ${task}, separados em essential_products, common_products e utensils. Para cada item gere: name (string), categoryId (um dos ids acima), categoryName (nome correspondente). Não inclua quantidades, medidas ou modo de preparo.`
                    }
                ],
                text: {
                    format: {
                        type: "json_schema",
                        name: "suggestion_schema",
                        schema: {
                            type: "object",
                            properties: {
                                essential_products: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: { type: "string" },
                                            categoryId: { type: "string" },
                                            categoryName: { type: "string" }
                                        },
                                        required: ["name", "categoryId", "categoryName"],
                                        additionalProperties: false
                                    }
                                },
                                common_products: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: { type: "string" },
                                            categoryId: { type: "string" },
                                            categoryName: { type: "string" }
                                        },
                                        required: ["name", "categoryId", "categoryName"],
                                        additionalProperties: false
                                    }
                                },
                                utensils: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: { type: "string" },
                                            categoryId: { type: "string" },
                                            categoryName: { type: "string" }
                                        },
                                        required: ["name", "categoryId", "categoryName"],
                                        additionalProperties: false
                                    }
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
            productElasticSearch.getProducts(item.name, 1, 100, item.categoryName)
        );

        // Aguarda todas as buscas e concatena os resultados
        const searchResults = await Promise.all(searchPromises);

        // Agrupa produtos por termo de busca original
        const productsBySearchTerm = allItems.map((item, index) => ({
            searchTerm: item.name,
            categoryName: item.categoryName,
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
                    searchTerms: allItems.map(item => item.name)
                }
            }
        };
    }
}

export default new AiProcessor();