import dotenv from 'dotenv';
dotenv.config({
    quiet: true
});

import cors from 'cors';
import express from 'express';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { Logger } from './utils/logger';
import { swaggerDocument } from './utils/swagger';

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(cors());

if (process.env.NODE_ENV !== "production") {
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (existsSync(uploadsDir)) {
        app.use("/uploads", express.static(uploadsDir));
        Logger.info("Server", "Serving static files from uploads directory", { uploadsDir });
    }
}

app.use('/api-docs', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
        cache: false,
        persistAuthorization: false
    },
    customCss: '.swagger-ui .topbar { display: none }'
}));

app.use('/api/v1/products', routes.productRoute);
app.use('/api/v1/markets', routes.marketRoute);
app.use('/api/v1/users', routes.userRoute);
app.use('/api/v1/categories', routes.categoriesRouter);
app.use('/api/v1/deliverers', routes.delivererRoute);
app.use('/api/v1/delivery-settings', routes.deliverySettingsRoute);
app.use('/api/v1/orders', routes.orderRoute);
app.use('/api/v1/suggestions', routes.suggestionRoute);
app.use('/api/v1/addresses', routes.addressRoute);
app.use('/api/v1/cart', routes.cartRoute);
app.use('/api/v1/cart-items', routes.cartItemRoute);
app.use('/api/v1/uploads', routes.uploadRoute);
app.use('/api/v1/reports', routes.reportsRoute);
app.use('/api/v1/chats', routes.chatRoute);
app.use('/api/v1/geo-location', routes.geocodingRoute);
app.use('/api/v1/campaigns', routes.campaignRoute);

app.get('/health', (_req, res) => {
    let version = 'unknown';
    try {
        const pkgPath = path.join(__dirname, '..', 'package.json');
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version?: string };
        version = pkg.version ?? version;
    } catch (err) {
        //
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

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, '0.0.0.0', () => {
    Logger.info('Server', 'Server running on', { url: `http://0.0.0.0:${PORT}` });
});
