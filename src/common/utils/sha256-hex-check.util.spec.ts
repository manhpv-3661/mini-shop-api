import { sha256HexCheck } from './sha256-hex-check.util';

describe('sha256HexCheck', () => {
  it('builds a SQL regex-match expression for the given column', () => {
    expect(sha256HexCheck('request_hash')).toBe(
      "request_hash ~ '^[0-9a-f]{64}$'",
    );
  });
});
