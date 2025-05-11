import { RBACService } from '../auth/rbac-service';

export class OnboardingService {
  private invites: { email: string; token: string; invited: number }[] = [];
  private ssoProvisioned: Set<string> = new Set();
  private rbac: RBACService;

  constructor(rbac: RBACService) {
    this.rbac = rbac;
  }

  inviteUser(email: string): string {
    const token = Math.random().toString(36).slice(2);
    this.invites.push({ email, token, invited: Date.now() });
    return token;
  }

  provisionSSO(userId: string) {
    this.ssoProvisioned.add(userId);
  }

  async assignRole(userId: string, role: string) {
    await this.rbac.assignRole(userId, role as any);
  }
} 