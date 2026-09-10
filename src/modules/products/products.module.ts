import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsModule } from '../attachments/attachments.module';
import { CategoriesModule } from '../categories/categories.module';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
    AttachmentsModule,
  ],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
