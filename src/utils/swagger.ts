import { marketPaths, marketSchemas, marketTags } from './schema/market';
import { metaSchemas } from './schema/meta';
import { productPaths, productSchemas, productTags } from './schema/product';
import { userPaths, userSchemas, userTags } from './schema/user';

export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Mercado Node API',
        version: '1.0.0',
        description: 'API para gerenciamento de mercados e produtos',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT}`,
            description: 'Servidor de desenvolvimento',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            ...productSchemas,
            ...marketSchemas,
            ...userSchemas,
            ...metaSchemas,
        },
    },  
    tags: [
            ...productTags,
            ...marketTags,
            ...userTags,
    ],
    paths: {
        ...productPaths,
        ...marketPaths,
        ...userPaths,
    },
};           