// Classe para construção e validação de parâmetros de consulta
export class QueryBuilder<TQuery extends Record<string, any> = {}> {
    private query: Record<string, any>;

    /**
     * Cria uma nova instância do construtor de parâmetros
     * @param query Parâmetros de consulta originais
     */
    constructor(query: Record<string, any>) {
        this.query = { ...query };
    }

    /**
     * Cria uma nova instância a partir de um objeto de consulta
     * @param query Objeto de consulta
     */
    static from<TQuery extends Record<string, any>>(query: TQuery): QueryBuilder<TQuery> {
        return new QueryBuilder(query);
    }

    /**
     * Adiciona um parâmetro numérico
     * @param key Nome do parâmetro
     * @param defaultValue Valor padrão (opcional)
     */
    withNumber<K extends string, V extends number | undefined = number | undefined>(
        key: K,
        defaultValue?: V
    ): QueryBuilder<TQuery & { [P in K]: number | V }> {
        const value = Number(this.query[key]);
        this.query[key] = !isNaN(value) ? value : defaultValue;
        return this as any;
    }

    /**
     * Adiciona um parâmetro de texto
     * @param key Nome do parâmetro
     * @param defaultValue Valor padrão (opcional)
     */
    withString<K extends string, V extends string | undefined = string | undefined>(
        key: K,
        defaultValue?: V
    ): QueryBuilder<TQuery & { [P in K]: string | V }> {
        const value = this.query[key];
        this.query[key] = typeof value === 'string' ? value : defaultValue;
        return this as any;
    }

    /**
     * Adiciona um parâmetro booleano
     * @param key Nome do parâmetro
     * @param defaultValue Valor padrão (opcional)
     */
    withBoolean<K extends string, V extends boolean | undefined = boolean | undefined>(
        key: K,
        defaultValue?: V
    ): QueryBuilder<TQuery & { [P in K]: boolean | V }> {
        const value = this.query[key];
        this.query[key] =
            value === 'true' || value === true
                ? true
                : value === 'false' || value === false
                    ? false
                    : defaultValue;
        return this as any;
    }

    /**
     * Adiciona um parâmetro array
     * @param key Nome do parâmetro
     * @param defaultValue Valor padrão (opcional)
     */
    withArray<K extends string, V extends any[] | undefined = any[] | undefined>(
        key: K,
        defaultValue?: V
    ): QueryBuilder<TQuery & { [P in K]: any[] | V }> {
        const value = this.query[key];

        if (Array.isArray(value)) {
            this.query[key] = value;
        } else if (value !== undefined) {
            this.query[key] = [value];
        } else {
            this.query[key] = defaultValue;
        }

        return this as any;
    }

    /**
     * Adiciona um parâmetro do tipo enum
     * @param key Nome do parâmetro
     * @param enumType Tipo do enum
     * @param defaultValue Valor padrão (opcional)
     */
    withEnum<K extends string, E extends Record<string, any>, V extends E[keyof E] | undefined = E[keyof E] | undefined>(
        key: K,
        enumType: E,
        defaultValue?: V
    ): QueryBuilder<TQuery & { [P in K]: E[keyof E] | V }> {
        const value = this.query[key];
        const enumValues = Object.values(enumType);
        
        this.query[key] = enumValues.includes(value) ? value : defaultValue;
        return this as any;
    }

    /**
     * Adiciona um parâmetro do tipo data
     * @param key Nome do parâmetro
     * @param defaultValue Valor padrão (opcional)
     */
    withDate<K extends string, V extends Date | undefined = Date | undefined>(
        key: K,
        defaultValue?: V
    ): QueryBuilder<TQuery & { [P in K]: Date | V }> {
        const value = this.query[key];
        
        if (typeof value === 'string') {
            const date = new Date(value);
            this.query[key] = !isNaN(date.getTime()) ? date : defaultValue;
        } else if (value instanceof Date) {
            this.query[key] = !isNaN(value.getTime()) ? value : defaultValue;
        } else {
            this.query[key] = defaultValue;
        }

        return this as any;
    }

    /**
     * Constrói o objeto final com os parâmetros processados
     */
    build(): TQuery {
        return this.query as TQuery;
    }
}
