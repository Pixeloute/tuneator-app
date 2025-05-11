import { ApiIntegration, Webhook, AccessScope } from './types';

export class ApiHubService {
  private integrations: ApiIntegration[] = [];
  private webhooks: Webhook[] = [];

  addIntegration(integration: ApiIntegration) {
    this.integrations.push(integration);
  }

  getIntegrations(provider?: string): ApiIntegration[] {
    return provider ? this.integrations.filter(i => i.provider === provider) : this.integrations;
  }

  addWebhook(webhook: Webhook) {
    this.webhooks.push(webhook);
  }

  getWebhooks(event?: string): Webhook[] {
    return event ? this.webhooks.filter(w => w.event === event) : this.webhooks;
  }

  checkScope(scope: AccessScope, integrationId: string): boolean {
    // Minimal stub: always true for now
    return true;
  }
} 