export interface SuggestedItem {
    name: string;
    categoryId: string; // existing category id selected by the agent
    categoryName: string; // human-readable category name
}

export interface SuggestionResponse {
    essential_products: SuggestedItem[];
    common_products: SuggestedItem[];
    utensils: SuggestedItem[];
    searchResults?: {
        productsBySearchTerm: {
            searchTerm: string;
            products: any[];
            meta: {
                total: number;
                page: number;
                size: number;
            };
        }[];
        statistics: {
            totalSearches: number;
            totalProductsFound: number;
            searchTerms: string[];
        };
    };
}

export interface AISuggestionResponse {
    id: string;
    object: string;
    created_at: number;
    status: string;
    background: boolean;
    billing: {
        payer: string;
    };
    error: null;
    incomplete_details: null;
    instructions: null;
    max_output_tokens: null;
    max_tool_calls: null;
    model: string;
    output: Array<{
        id: string;
        type: string;
        status: string;
        content: Array<{
            type: string;
            annotations: any[];
            logprobs: any[];
            text: string;
        }>;
        role: string;
    }>;
    parallel_tool_calls: boolean;
    previous_response_id: null;
    prompt_cache_key: null;
    reasoning: {
        effort: null;
        summary: null;
    };
    safety_identifier: null;
    service_tier: string;
    store: boolean;
    temperature: number;
    text: {
        format: {
            type: string;
            description: null;
            name: string;
            schema: any; // schema varies by prompt; parsed downstream
            strict: boolean;
        };
        verbosity: string;
    };
    tool_choice: string;
    tools: any[];
    top_logprobs: number;
    top_p: number;
    truncation: string;
    usage: {
        input_tokens: number;
        input_tokens_details: {
            cached_tokens: number;
        };
        output_tokens: number;
        output_tokens_details: {
            reasoning_tokens: number;
        };
        total_tokens: number;
    };
    user: null;
    metadata: Record<string, any>;
}