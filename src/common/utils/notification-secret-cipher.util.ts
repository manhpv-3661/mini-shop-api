import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export const NOTIFICATION_SECRET_KEY_LENGTH_BYTES = 32;

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 12;
const AUTH_TAG_LENGTH_BYTES = 16;

export function encryptNotificationSecret(
  plaintext: string,
  key: Buffer,
): Buffer {
  const iv = randomBytes(IV_LENGTH_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]);
}

export function decryptNotificationSecret(
  payload: Buffer,
  key: Buffer,
): string {
  const iv = payload.subarray(0, IV_LENGTH_BYTES);
  const authTag = payload.subarray(
    IV_LENGTH_BYTES,
    IV_LENGTH_BYTES + AUTH_TAG_LENGTH_BYTES,
  );
  const ciphertext = payload.subarray(IV_LENGTH_BYTES + AUTH_TAG_LENGTH_BYTES);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8');
}
