import { Request } from 'express';
import { extractBearerToken } from './extract-bearer-token.util';

describe('extractBearerToken', () => {
  it('extracts a bearer token from the authorization header', () => {
    const request = {
      headers: { authorization: 'Bearer signed-token' },
    } as Request;

    expect(extractBearerToken(request)).toBe('signed-token');
  });

  it('returns null when no bearer credential is present', () => {
    expect(extractBearerToken({ headers: {} } as Request)).toBeNull();
  });
});
