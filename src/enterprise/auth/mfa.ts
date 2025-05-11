import { authenticator } from 'otplib';

export class MFAService {
  // In real use, store secrets securely per user
  private secrets = new Map<string, string>();

  generateSecret(userId: string): string {
    const secret = authenticator.generateSecret();
    this.secrets.set(userId, secret);
    return secret;
  }

  getSecret(userId: string): string | undefined {
    return this.secrets.get(userId);
  }

  verify(userId: string, token: string): boolean {
    const secret = this.secrets.get(userId);
    if (!secret) return false;
    return authenticator.check(token, secret);
  }
} 