import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { OrdersModule } from '../orders/orders.module';
import { EmailNotification } from './entities/email-notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailNotification]),
    AuthModule,
    OrdersModule,
  ],
  exports: [TypeOrmModule],
})
export class NotificationsModule {}
