import { RBACService } from '../auth/rbac-service';
import { Permission } from '../auth/types';

export function validateInput(schema: any, data: any): boolean {
  // Minimal: check required fields
  return schema.required.every((k: string) => data[k] !== undefined && data[k] !== null);
}

export function handleError(res: any, err: any) {
  res.status(400).json({ error: err.message || 'Bad Request' });
}

export async function checkRBAC(rbac: RBACService, userId: string, permission: Permission, opts?: any): Promise<boolean> {
  return rbac.checkPermission(userId, permission, opts);
} 