import axios from 'axios';
import crypto from 'crypto';

export class WebhookService {
  private hooks: { event: string; url: string; secret: string }[] = [];

  register(event: string, url: string, secret: string) {
    this.hooks.push({ event, url, secret });
  }

  async trigger(event: string, data: any) {
    const hooks = this.hooks.filter(h => h.event === event);
    for (const h of hooks) {
      const payload = JSON.stringify(data);
      const signature = crypto.createHmac('sha256', h.secret).update(payload).digest('hex');
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await axios.post(h.url, payload, {
            headers: {
              'Content-Type': 'application/json',
              'X-Signature': signature,
            },
            timeout: 5000,
          });
          break;
        } catch (e) {
          if (attempt === 2) throw e;
        }
      }
    }
  }
} 