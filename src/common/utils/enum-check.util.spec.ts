import { enumCheck } from './enum-check.util';

describe('enumCheck', () => {
  it('builds a SQL IN (...) expression quoting every value', () => {
    expect(enumCheck('role', ['CUSTOMER', 'ADMIN'])).toBe(
      "role IN ('CUSTOMER', 'ADMIN')",
    );
  });

  it('supports a single value', () => {
    expect(enumCheck('status', ['PENDING'])).toBe("status IN ('PENDING')");
  });
});
