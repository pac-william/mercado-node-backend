import OpenAI from 'openai';

// Inicializa o cliente OpenAI apenas se a chave estiver disponível
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

export interface AiSearchItem {
    nome: string;
    quantidade: string;
}

export interface AiSearchResponse {
    contexto: string;
    itens: AiSearchItem[];
}

export interface ProductMatch {
    item_ia: string;
    produto?: {
        id: string;
        nome: string;
        preco: number;
        loja_id: string;
        estoque?: number;
        market?: {
            id: string;
            name: string;
            address: string;
        };
    };
    status?: string;
}

export interface AiSearchResult {
    contexto: string;
    produtos: ProductMatch[];
}

class AiService {
    private readonly SYSTEM_PROMPT = `Você é um assistente especializado em identificar ingredientes e produtos necessários para receitas e preparações culinárias.

INSTRUÇÕES IMPORTANTES:
1. Analise o texto do usuário e identifique TODOS os ingredientes/produtos necessários
2. Responda APENAS em JSON válido, sem texto adicional
3. Use nomes genéricos dos ingredientes (ex: "cenoura", "farinha de trigo", "açúcar")
4. Inclua quantidades aproximadas quando possível
5. Seja específico mas use nomes comuns de produtos

FORMATO DE RESPOSTA OBRIGATÓRIO:
{
  "contexto": "descrição breve do que o usuário quer fazer",
  "itens": [
    {"nome": "nome do ingrediente", "quantidade": "quantidade aproximada"},
    {"nome": "nome do ingrediente", "quantidade": "quantidade aproximada"}
  ]
}

EXEMPLOS:
- "Quero fazer um bolo de cenoura" → incluir cenoura, farinha, açúcar, ovos, óleo, fermento
- "Preciso preparar churrasco para 5 pessoas" → incluir carnes, carvão, temperos, pão, bebidas
- "Vou fazer uma salada" → incluir alface, tomate, cebola, azeite, vinagre, sal

IMPORTANTE: Responda apenas o JSON, sem explicações ou texto adicional.`;

    async searchProducts(prompt: string): Promise<AiSearchResponse> {
        if (!openai) {
            // Fallback para quando não há chave da OpenAI configurada
            return this.getFallbackResponse(prompt);
        }

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o", // Usando GPT-4o como GPT-5 ainda não está disponível
                messages: [
                    {
                        role: "system",
                        content: this.SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            });

            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('Resposta vazia da IA');
            }

            // Parse do JSON retornado pela IA
            const parsedResponse = JSON.parse(response) as AiSearchResponse;
            
            // Validação básica
            if (!parsedResponse.contexto || !Array.isArray(parsedResponse.itens)) {
                throw new Error('Formato de resposta inválido da IA');
            }

            return parsedResponse;
        } catch (error) {
            console.error('Erro ao consultar IA:', error);
            // Fallback em caso de erro
            return this.getFallbackResponse(prompt);
        }
    }

    /**
     * Resposta de fallback quando a IA não está disponível
     */
    private getFallbackResponse(prompt: string): AiSearchResponse {
        const lowerPrompt = prompt.toLowerCase();
        
        // Mapeamento básico de receitas comuns
        if (lowerPrompt.includes('bolo') && lowerPrompt.includes('cenoura')) {
            return {
                contexto: "Bolo de cenoura",
                itens: [
                    { nome: "cenoura", quantidade: "3 unidades" },
                    { nome: "farinha de trigo", quantidade: "2 xícaras" },
                    { nome: "açúcar", quantidade: "2 xícaras" },
                    { nome: "ovos", quantidade: "3 unidades" },
                    { nome: "óleo", quantidade: "1/2 xícara" },
                    { nome: "fermento em pó", quantidade: "1 colher de sopa" }
                ]
            };
        }
        
        if (lowerPrompt.includes('churrasco')) {
            return {
                contexto: "Churrasco",
                itens: [
                    { nome: "carne bovina", quantidade: "1kg" },
                    { nome: "carvão", quantidade: "3kg" },
                    { nome: "sal grosso", quantidade: "1 pacote" },
                    { nome: "pão de alho", quantidade: "1 unidade" },
                    { nome: "bebida", quantidade: "2 litros" }
                ]
            };
        }
        
        if (lowerPrompt.includes('salada')) {
            return {
                contexto: "Salada",
                itens: [
                    { nome: "alface", quantidade: "1 unidade" },
                    { nome: "tomate", quantidade: "3 unidades" },
                    { nome: "cebola", quantidade: "1 unidade" },
                    { nome: "azeite", quantidade: "1 garrafa" },
                    { nome: "vinagre", quantidade: "1 garrafa" },
                    { nome: "sal", quantidade: "1 pacote" }
                ]
            };
        }
        
        // Resposta genérica
        return {
            contexto: "Preparação culinária",
            itens: [
                { nome: "ingrediente principal", quantidade: "conforme necessário" },
                { nome: "temperos", quantidade: "a gosto" },
                { nome: "óleo", quantidade: "1 colher" }
            ]
        };
    }

    async normalizeAiResponse(aiResponse: string): Promise<AiSearchResponse> {
        try {
            // Remove possíveis caracteres extras e tenta fazer parse
            const cleanResponse = aiResponse.trim();
            const parsed = JSON.parse(cleanResponse) as AiSearchResponse;
            
            // Validação
            if (!parsed.contexto || !Array.isArray(parsed.itens)) {
                throw new Error('Formato de resposta inválido');
            }

            return parsed;
        } catch (error) {
            console.error('Erro ao normalizar resposta da IA:', error);
            throw new Error('Erro ao processar resposta da IA');
        }
    }
}

export const aiService = new AiService();
