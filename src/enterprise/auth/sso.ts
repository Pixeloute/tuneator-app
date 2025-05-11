import { Issuer, Client, TokenSet } from 'openid-client';

export type SSOProvider = 'google';

export class SSOService {
  private client: Client | null = null;

  async initialize() {
    const googleIssuer = await Issuer.discover('https://accounts.google.com');
    this.client = new googleIssuer.Client({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uris: [process.env.GOOGLE_REDIRECT_URI!],
      response_types: ['code'],
    });
  }

  async authenticate(token: string): Promise<{ userId: string } | null> {
    if (!this.client) throw new Error('SSO client not initialized');
    let userinfo: any;
    try {
      const ts = await this.client.callback(process.env.GOOGLE_REDIRECT_URI!, { code: token });
      userinfo = await this.client.userinfo(ts.access_token!);
    } catch {
      return null;
    }
    return { userId: userinfo.sub };
  }
} 