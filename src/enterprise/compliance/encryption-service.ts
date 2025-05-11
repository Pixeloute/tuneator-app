import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

export class AES256EncryptionService {
  encrypt(data: string, key: Buffer): { iv: Buffer; encrypted: Buffer; tag: Buffer } {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return { iv, encrypted, tag };
  }

  decrypt(encrypted: Buffer, key: Buffer, iv: Buffer, tag: Buffer): string {
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  }
} 