import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  async blacklistToken(tokenId: string, ttlSeconds: number): Promise<void> {
    await this.client.set(this.blacklistKey(tokenId), '1', 'EX', ttlSeconds);
  }

  async isTokenBlacklisted(tokenId: string): Promise<boolean> {
    return (await this.client.get(this.blacklistKey(tokenId))) !== null;
  }

  private blacklistKey(tokenId: string): string {
    return `auth:blacklist:${tokenId}`;
  }
}
