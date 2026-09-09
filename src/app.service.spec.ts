import { I18nService } from 'nestjs-i18n';
import { AppService } from './app.service';

describe('AppService', () => {
  it('returns the service health response', () => {
    const i18n = { t: jest.fn().mockReturnValue('Mini Shop API is ready') };
    const service = new AppService(i18n as unknown as I18nService);

    const result = service.getHealth();

    expect(result).toMatchObject({
      status: 'ok',
      service: 'mini-shop-api',
      message: 'Mini Shop API is ready',
    });
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    expect(i18n.t).toHaveBeenCalledWith('common.ready');
  });
});
