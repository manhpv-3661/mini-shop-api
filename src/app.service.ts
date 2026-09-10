import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { HealthResponseDto } from './app.dto';

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nService) {}

  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      service: 'mini-shop-api',
      message: this.i18n.t('common.ready'),
      timestamp: new Date().toISOString(),
    };
  }
}
