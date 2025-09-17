import { prisma } from "../utils/prisma";
import { AiSearchItem, ProductMatch } from "./aiService";

class ProductSearchService {
    /**
     * Busca produtos no banco de dados baseado nos itens retornados pela IA
     */
    async searchProductsByAiItems(items: AiSearchItem[]): Promise<ProductMatch[]> {
        const results: ProductMatch[] = [];

        for (const item of items) {
            const productMatch = await this.findProductMatch(item.nome);
            results.push(productMatch);
        }

        return results;
    }

    /**
     * Busca um produto específico baseado no nome do ingrediente
     */
    private async findProductMatch(ingredientName: string): Promise<ProductMatch> {
        try {
            // Normaliza o nome do ingrediente para busca
            const normalizedName = this.normalizeIngredientName(ingredientName);
            
            // Busca exata primeiro
            let product = await this.searchExactMatch(normalizedName);
            
            // Se não encontrou, busca por similaridade
            if (!product) {
                product = await this.searchSimilarMatch(normalizedName);
            }
            
            // Se ainda não encontrou, busca por palavras-chave
            if (!product) {
                product = await this.searchKeywordMatch(normalizedName);
            }

            if (product) {
                return {
                    item_ia: ingredientName,
                    produto: {
                        id: product.id,
                        nome: product.name,
                        preco: product.price,
                        loja_id: product.marketId,
                        market: product.market ? {
                            id: product.market.id,
                            name: product.market.name,
                            address: product.market.address,
                        } : undefined,
                    }
                };
            }

            return {
                item_ia: ingredientName,
                status: "não encontrado"
            };
        } catch (error) {
            console.error(`Erro ao buscar produto para "${ingredientName}":`, error);
            return {
                item_ia: ingredientName,
                status: "erro na busca"
            };
        }
    }

    /**
     * Normaliza o nome do ingrediente para melhor busca
     */
    private normalizeIngredientName(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s]/g, '') // Remove caracteres especiais
            .replace(/\s+/g, ' '); // Normaliza espaços
    }

    /**
     * Busca exata por nome do produto
     */
    private async searchExactMatch(normalizedName: string) {
        return await prisma.product.findFirst({
            where: {
                name: {
                    equals: normalizedName,
                    mode: 'insensitive'
                }
            },
            include: {
                market: true
            }
        });
    }

    /**
     * Busca por similaridade usando LIKE
     */
    private async searchSimilarMatch(normalizedName: string) {
        return await prisma.product.findFirst({
            where: {
                name: {
                    contains: normalizedName,
                    mode: 'insensitive'
                }
            },
            include: {
                market: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    }

    /**
     * Busca por palavras-chave (divide o nome em palavras e busca)
     */
    private async searchKeywordMatch(normalizedName: string) {
        const keywords = normalizedName.split(' ').filter(word => word.length > 2);
        
        for (const keyword of keywords) {
            const product = await prisma.product.findFirst({
                where: {
                    name: {
                        contains: keyword,
                        mode: 'insensitive'
                    }
                },
                include: {
                    market: true
                }
            });
            
            if (product) {
                return product;
            }
        }
        
        return null;
    }

    /**
     * Busca produtos por categoria (para casos específicos)
     */
    async searchProductsByCategory(categoryName: string) {
        return await prisma.product.findMany({
            where: {
                category: {
                    name: {
                        contains: categoryName,
                        mode: 'insensitive'
                    }
                }
            },
            include: {
                market: true,
                category: true
            },
            take: 10
        });
    }

    /**
     * Busca produtos similares baseado em um produto existente
     */
    async findSimilarProducts(productId: string) {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { category: true }
        });

        if (!product) return [];

        return await prisma.product.findMany({
            where: {
                AND: [
                    { id: { not: productId } },
                    {
                        OR: [
                            { categoryId: product.categoryId },
                            { name: { contains: product.name.split(' ')[0], mode: 'insensitive' } }
                        ]
                    }
                ]
            },
            include: {
                market: true,
                category: true
            },
            take: 5
        });
    }
}

export const productSearchService = new ProductSearchService();
