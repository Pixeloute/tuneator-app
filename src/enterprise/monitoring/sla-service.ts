export type SLATier = 'basic' | 'premium' | 'enterprise';

export class SLAService {
  private tier: SLATier = 'basic';
  private uptime: number = 100;

  setTier(tier: SLATier) {
    this.tier = tier;
  }

  setUptime(uptime: number) {
    this.uptime = uptime;
  }

  getSLA() {
    return { tier: this.tier, uptime: this.uptime };
  }
} 