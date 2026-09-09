import {
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { I18nValidationException } from 'nestjs-i18n';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let json: jest.Mock;
  let status: jest.Mock;
  let host: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    host = {
      switchToHttp: () => ({ getResponse: () => ({ status }) }),
    } as unknown as ArgumentsHost;
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('wraps an HTTP exception in the common error envelope', () => {
    filter.catch(new ConflictException('Email already registered'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith({
      errors: { body: ['Email already registered'] },
    });
  });

  it('flattens i18n validation constraints', () => {
    filter.catch(
      new I18nValidationException([
        { property: 'email', constraints: { isEmail: 'Email is invalid' } },
      ]),
      host,
    );

    expect(json).toHaveBeenCalledWith({
      errors: { body: ['Email is invalid'] },
    });
  });

  it('keeps every message returned by a validation exception', () => {
    filter.catch(
      new BadRequestException(['Name is required', 'Name is invalid']),
      host,
    );

    expect(json).toHaveBeenCalledWith({
      errors: { body: ['Name is required', 'Name is invalid'] },
    });
  });

  it('uses a generic label when an HTTP response has no message', () => {
    filter.catch(new HttpException({}, HttpStatus.I_AM_A_TEAPOT), host);

    expect(json).toHaveBeenCalledWith({ errors: { body: ['Error'] } });
  });

  it('does not leak an unexpected error message', () => {
    filter.catch(new Error('password=secret'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(JSON.stringify(json.mock.calls)).not.toContain('secret');
  });
});
