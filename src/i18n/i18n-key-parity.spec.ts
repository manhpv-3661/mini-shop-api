import { readFileSync } from 'fs';
import { join } from 'path';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nested]) =>
    flattenKeys(nested, prefix ? `${prefix}.${key}` : key),
  );
}

describe('i18n resources', () => {
  it.each(['common.json', 'errors.json', 'validation.json'])(
    'keeps English and Vietnamese keys aligned in %s',
    (file) => {
      const read = (language: string): unknown =>
        JSON.parse(
          readFileSync(join(__dirname, language, file), 'utf8'),
        ) as unknown;

      expect(flattenKeys(read('vi')).sort()).toEqual(
        flattenKeys(read('en')).sort(),
      );
    },
  );
});
