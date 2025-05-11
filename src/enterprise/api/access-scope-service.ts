import jwt from 'jsonwebtoken';

export type AccessScope = 'read-only' | 'write' | 'audit-only';

export class AccessScopeService {
  private scopes: { userId: string; scope: AccessScope }[] = [];

  setScope(userId: string, scope: AccessScope) {
    const idx = this.scopes.findIndex(s => s.userId === userId);
    if (idx === -1) this.scopes.push({ userId, scope });
    else this.scopes[idx].scope = scope;
  }

  getScope(userId: string): AccessScope | undefined {
    return this.scopes.find(s => s.userId === userId)?.scope;
  }

  generateToken(userId: string, secret: string): string {
    return jwt.sign({ userId }, secret, { expiresIn: '1h' });
  }

  verifyToken(token: string, secret: string): string | null {
    try {
      const payload = jwt.verify(token, secret) as { userId: string };
      return payload.userId;
    } catch {
      return null;
    }
  }
} 