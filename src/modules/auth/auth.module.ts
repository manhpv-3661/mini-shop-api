import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from './entities/auth-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthToken])],
  exports: [TypeOrmModule],
})
export class AuthModule {}
