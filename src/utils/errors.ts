export class UniqueConstraintError extends Error {
    fields: string[];
    constructor(fields: string[]) {
        super(`Já existe um registro com os seguintes campos únicos: ${fields.join(', ')}`);
        this.name = "UniqueConstraintError";
        this.fields = fields;
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
} 

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
    }
} 