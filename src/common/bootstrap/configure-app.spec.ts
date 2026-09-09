import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { configureApp } from './configure-app';

describe('configureApp', () => {
  it('applies the same prefix and global handlers to every app bootstrap', () => {
    const config = {
      getOrThrow: jest.fn().mockReturnValue('api/v1'),
    } as unknown as ConfigService;
    const reflector = new Reflector();
    const setGlobalPrefix = jest.fn();
    const useGlobalPipes = jest.fn();
    const useGlobalInterceptors = jest.fn();
    const useGlobalFilters = jest.fn();
    const app = {
      get: jest.fn((token: unknown) =>
        token === ConfigService ? config : reflector,
      ),
      setGlobalPrefix,
      useGlobalPipes,
      useGlobalInterceptors,
      useGlobalFilters,
    } as unknown as INestApplication;

    configureApp(app);

    expect(setGlobalPrefix).toHaveBeenCalledWith('api/v1');
    expect(useGlobalPipes).toHaveBeenCalledTimes(1);
    expect(useGlobalInterceptors).toHaveBeenCalledTimes(1);
    expect(useGlobalFilters).toHaveBeenCalledTimes(1);
  });
});
