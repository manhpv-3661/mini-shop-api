import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp } from './utils/create-test-app';

describe('System health (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /api/v1/health returns the English response by default', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ok',
      service: 'mini-shop-api',
      message: 'Mini Shop API is ready',
    });
  });

  it('resolves Vietnamese from the x-lang header', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .set('x-lang', 'vi')
      .expect(200);

    const body = response.body as { message: string };
    expect(body.message).toBe('Mini Shop API đã sẵn sàng');
  });
});
