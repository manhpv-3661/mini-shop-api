import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

const bearerTokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();

export function extractBearerToken(request: Request): string | null {
  return bearerTokenExtractor(request);
}
