import { Meta } from "./metaDomain";

export class Suggestion {
    constructor(
        public id: string,
        public userId: string,
        public task: string,
        public data: any,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}

export class SuggestionListItem {
    constructor(
        public id: string
    ) { }
}

export class SuggestionPaginatedResponse {
    constructor(
        public suggestions: SuggestionListItem[],
        public meta: Meta,
    ) { }
}

