import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  it('delegates the health response to AppService', async () => {
    const response = {
      status: 'ok',
      service: 'mini-shop-api',
      message: 'ready',
      timestamp: '2026-09-09T03:00:00.000Z',
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: { getHealth: () => response } },
      ],
    }).compile();

    expect(module.get(AppController).getHealth()).toEqual(response);
  });
});
