import { QueryFailedError } from 'typeorm';
import {
  getViolatedConstraint,
  isUniqueViolation,
} from './postgres-unique-violation.util';

function queryError(code: string, constraint?: string): QueryFailedError {
  return new QueryFailedError(
    'INSERT INTO users ...',
    [],
    Object.assign(new Error('database error'), { code, constraint }),
  );
}

describe('PostgreSQL unique violation helpers', () => {
  it('recognizes SQLSTATE 23505 and exposes its constraint', () => {
    const error = queryError('23505', 'uq_users_email');

    expect(isUniqueViolation(error)).toBe(true);
    expect(getViolatedConstraint(error)).toBe('uq_users_email');
  });

  it('rejects other database and application errors', () => {
    expect(isUniqueViolation(queryError('23503'))).toBe(false);
    expect(isUniqueViolation(new Error('not a database error'))).toBe(false);
  });
});
