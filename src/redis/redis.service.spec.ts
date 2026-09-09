import Redis from 'ioredis';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  const client = {
    get: jest.fn(),
    quit: jest.fn(),
    set: jest.fn(),
  };
  let service: RedisService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RedisService(client as unknown as Redis);
  });

  it('stores a token identifier with the requested TTL', async () => {
    client.set.mockResolvedValue('OK');

    await service.blacklistToken('token-id', 120);

    expect(client.set).toHaveBeenCalledWith(
      'auth:blacklist:token-id',
      '1',
      'EX',
      120,
    );
  });

  it.each([
    ['1', true],
    [null, false],
  ])('maps a stored value of %p to %p', async (stored, expected) => {
    client.get.mockResolvedValue(stored);

    await expect(service.isTokenBlacklisted('token-id')).resolves.toBe(
      expected,
    );
  });

  it('closes the Redis connection during application shutdown', async () => {
    client.quit.mockResolvedValue('OK');

    await service.onModuleDestroy();

    expect(client.quit).toHaveBeenCalledTimes(1);
  });
});
