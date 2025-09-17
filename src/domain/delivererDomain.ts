import { Meta } from "./metaDomain";

export class Deliverer {
    constructor(
        public id: string,
        public name: string,
        public document: string,
        public phone: string,
        public status: "ACTIVE" | "INACTIVE",
        public vehicle: {
            type: string;
            plate?: string;
            description?: string;
        },
    ) { }
}

export class DelivererPaginatedResponse {
    constructor(
        public deliverers: Deliverer[],
        public meta: Meta,
    ) { }
} 