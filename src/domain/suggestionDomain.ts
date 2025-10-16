import { Meta } from "./metaDomain";

export class Suggestion {
    constructor(
        public id: string,
        public task: string,
        public data: any,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}

export class SuggestionPaginatedResponse {
    constructor(
        public suggestions: Suggestion[],
        public meta: Meta,
    ) { }
}

