import { marketPaths, marketSchemas, marketTags } from './schema/market';
import { metaSchemas } from './schema/meta';
import { productPaths, productSchemas, productTags } from './schema/product';
import { userPaths, userSchemas, userTags } from './schema/user';
import { categoriesPaths, categoriesSchemas, categoriesTags } from './schema/categories';
import { delivererPaths, delivererSchemas, delivererTags } from './schema/deliverer';
import { orderPaths, orderSchemas, orderTags } from './schema/order';

export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Mercado Node API',
        version: '1.0.0',
        description: 'API para marketplace de mercados'
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT}`,
            description: 'Servidor de desenvolvimento'
        }
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
            ...metaSchemas,
            ...marketSchemas,
            ...productSchemas,
            ...userSchemas,
            ...categoriesSchemas,
            ...delivererSchemas,
            ...orderSchemas
        },
    },
    tags: [
        ...marketTags,
        ...productTags,
        ...userTags,
        ...categoriesTags,
        ...delivererTags,
        ...orderTags
    ],
    paths: {
        ...marketPaths,
        ...productPaths,
        ...userPaths,
        ...categoriesPaths,
        ...delivererPaths,
        ...orderPaths
    },
};
