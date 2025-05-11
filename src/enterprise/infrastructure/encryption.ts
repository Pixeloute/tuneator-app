export type EncryptionConfig = {
  atRest: boolean;
  inTransit: boolean;
  algorithm: 'AES-256';
};

export class EncryptionService {
  config: EncryptionConfig = { atRest: true, inTransit: true, algorithm: 'AES-256' };

  encrypt(data: string, key: CryptoKey): Promise<ArrayBuffer> {
    // Placeholder: use WebCrypto in real use
    return Promise.resolve(new TextEncoder().encode(data));
  }

  decrypt(data: ArrayBuffer, key: CryptoKey): Promise<string> {
    // Placeholder: use WebCrypto in real use
    return Promise.resolve(new TextDecoder().decode(data));
  }
} 