import { randomBytes } from 'crypto';
import {
  decryptNotificationSecret,
  encryptNotificationSecret,
} from './notification-secret-cipher.util';

describe('notification-secret-cipher.util', () => {
  const key = randomBytes(32);

  it('decrypts back to the original plaintext', () => {
    const ciphertext = encryptNotificationSecret('raw-activation-token', key);

    expect(decryptNotificationSecret(ciphertext, key)).toBe(
      'raw-activation-token',
    );
  });

  it('produces a different ciphertext each time (random IV)', () => {
    const first = encryptNotificationSecret('same-token', key);
    const second = encryptNotificationSecret('same-token', key);

    expect(first.equals(second)).toBe(false);
  });

  it('fails to decrypt with the wrong key', () => {
    const ciphertext = encryptNotificationSecret('raw-token', key);
    const wrongKey = randomBytes(32);

    expect(() => decryptNotificationSecret(ciphertext, wrongKey)).toThrow();
  });

  it('fails to decrypt tampered ciphertext (auth tag mismatch)', () => {
    const ciphertext = encryptNotificationSecret('raw-token', key);
    ciphertext[ciphertext.length - 1] ^= 0xff;

    expect(() => decryptNotificationSecret(ciphertext, key)).toThrow();
  });
});
