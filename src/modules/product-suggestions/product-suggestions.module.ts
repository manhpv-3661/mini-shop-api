import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ProductSuggestion } from './entities/product-suggestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSuggestion]), UsersModule],
  exports: [TypeOrmModule],
})
export class ProductSuggestionsModule {}
