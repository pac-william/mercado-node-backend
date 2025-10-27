import dotenv from 'dotenv';
dotenv.config({
    quiet: true
});

import cors from 'cors';
import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { Logger } from './utils/logger';
import { swaggerDocument } from './utils/swagger';

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(cors({ 
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/products', routes.productRoute);
app.use('/api/v1/markets', routes.marketRoute);
app.use('/api/v1/users', routes.userRoute);
app.use('/api/v1/categories', routes.categoriesRouter);
app.use('/api/v1/deliverers', routes.delivererRoute);
app.use('/api/v1/orders', routes.orderRoute);
app.use('/api/v1/auth', routes.authRoute);
app.use('/api/v1/suggestions', routes.suggestionRoute);
app.use('/api/v1/addresses', routes.addressRoute);
app.use('/api/v1/cart', routes.cartRoute);
app.use('/api/v1/cart-items', routes.cartItemRoute);

// Health check route
app.get('/health', (_req, res) => {
    let version = 'unknown';
    try {
        const pkgPath = path.join(__dirname, '..', 'package.json');
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version?: string };
        version = pkg.version ?? version;
    } catch (err) {
        // keep version as 'unknown' if reading fails
    }

    res.status(200).json({
        success: true,
        data: {
            status: 'ok',
            uptime: process.uptime(),
            version,
            timestamp: new Date().toISOString()
        }
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    Logger.info('Server', 'Server running on port', { url: `http://localhost:${PORT}`, apiDocs: `http://localhost:${PORT}/api-docs` });
});
