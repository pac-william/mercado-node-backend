import request from 'supertest';
import express from 'express';
import cors from 'cors';
import routes from '../../src/routes';

const createTestApp = () => {
  const app = express();

  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  app.use(cors({ 
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));

  app.use('/api/v1/products', routes.productRoute);
  app.use('/api/v1/markets', routes.marketRoute);
  app.use('/api/v1/users', routes.userRoute);
  app.use('/api/v1/categories', routes.categoriesRouter);
  app.use('/api/v1/deliverers', routes.delivererRoute);
  app.use('/api/v1/orders', routes.orderRoute);
  app.use('/api/v1/auth', routes.authRoute);

  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        uptime: process.uptime(),
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    });
  });

  return app;
};

describe('Server Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('Health Endpoint', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'ok');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('version');
      expect(response.body.data).toHaveProperty('timestamp');
    });
  });

  describe('CORS Configuration', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/v1/auth/login')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should include CORS headers in responses', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('JSON Parsing', () => {
    it('should parse JSON request body', async () => {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/auth/register/user')
        .send(testData);

      expect(response.status).not.toBe(404);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register/user')
        .set('Content-Type', 'application/json')
        .send('{"name": "Test", "email": "test@example.com", "password": "123"');

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Route Registration', () => {
    it('should register auth routes', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).not.toBe(404);
    });

    it('should register user routes', async () => {
      const response = await request(app)
        .get('/api/v1/users');

      expect(response.status).not.toBe(404);
    });

    it('should register product routes', async () => {
      const response = await request(app)
        .get('/api/v1/products');

      expect(response.status).not.toBe(404);
    });

    it('should register market routes', async () => {
      const response = await request(app)
        .get('/api/v1/markets');

      expect(response.status).not.toBe(404);
    });

    it('should register category routes', async () => {
      const response = await request(app)
        .get('/api/v1/categories');

      expect(response.status).not.toBe(404);
    });

    it('should register deliverer routes', async () => {
      const response = await request(app)
        .get('/api/v1/deliverers');

      expect(response.status).not.toBe(404);
    });

    it('should register order routes', async () => {
      const response = await request(app)
        .get('/api/v1/orders');

      expect(response.status).not.toBe(404);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/v1/non-existent')
        .expect(404);

      expect(response.status).toBe(404);
    });

    it('should handle requests to root path', async () => {
      const response = await request(app)
        .get('/')
        .expect(404);

      expect(response.status).toBe(404);
    });
  });

  describe('Request Size Limits', () => {
    it('should handle requests within size limits', async () => {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        description: 'A'.repeat(1000)
      };

      const response = await request(app)
        .post('/api/v1/auth/register/user')
        .send(testData);

      expect(response.status).not.toBe(404);
    });

    it('should reject requests exceeding size limits', async () => {
      const largeData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        description: 'A'.repeat(6 * 1024 * 1024)
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(largeData)
        .expect(413);

      expect(response.status).toBe(413);
    });
  });
});