import dotenv from 'dotenv';
dotenv.config({
    quiet: true
});

import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { Logger } from './utils/logger';
import { swaggerDocument } from './utils/swagger';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: '*' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/products', routes.productRoute);
app.use('/api/v1/markets', routes.marketRoute);
app.use('/api/v1/users', routes.userRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    Logger.info('Server', 'Server running on port', { url: `http://localhost:${PORT}`, apiDocs: `http://localhost:${PORT}/api-docs` });
});