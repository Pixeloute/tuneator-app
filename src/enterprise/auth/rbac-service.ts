import { Role, Permission, UserRole } from './types';

export class RBACService {
  private rolePermissions: Map<Role, Set<Permission>> = new Map();
  private userRoles: Map<string, UserRole> = new Map();
  private catalogMatrix: Map<string, Set<Permission>> = new Map();
  private projectMatrix: Map<string, Set<Permission>> = new Map();
  private artistMatrix: Map<string, Set<Permission>> = new Map();

  constructor() {
    this.initializeDefaultRoles();
  }

  private initializeDefaultRoles() {
    this.rolePermissions.set('metadata_admin', new Set([
      'read_metadata',
      'write_metadata',
      'approve_changes',
      'export_data',
    ]));
    this.rolePermissions.set('royalty_viewer', new Set([
      'read_metadata',
      'view_royalties',
    ]));
  }

  async checkPermission(userId: string, permission: Permission, opts?: { catalogId?: string; projectId?: string; artistId?: string }): Promise<boolean> {
    const userRole = this.userRoles.get(userId);
    if (!userRole) return false;
    if (opts?.catalogId && this.catalogMatrix.get(opts.catalogId)?.has(permission)) return true;
    if (opts?.projectId && this.projectMatrix.get(opts.projectId)?.has(permission)) return true;
    if (opts?.artistId && this.artistMatrix.get(opts.artistId)?.has(permission)) return true;
    return userRole.roles.some(role => this.rolePermissions.get(role)?.has(permission));
  }

  async assignRole(userId: string, role: Role): Promise<void> {
    const userRole = this.userRoles.get(userId) || { userId, roles: [], mfaEnabled: false };
    if (!userRole.roles.includes(role)) userRole.roles.push(role);
    this.userRoles.set(userId, userRole);
  }

  setCatalogPermission(catalogId: string, permission: Permission) {
    if (!this.catalogMatrix.has(catalogId)) this.catalogMatrix.set(catalogId, new Set());
    this.catalogMatrix.get(catalogId)!.add(permission);
  }

  setProjectPermission(projectId: string, permission: Permission) {
    if (!this.projectMatrix.has(projectId)) this.projectMatrix.set(projectId, new Set());
    this.projectMatrix.get(projectId)!.add(permission);
  }

  setArtistPermission(artistId: string, permission: Permission) {
    if (!this.artistMatrix.has(artistId)) this.artistMatrix.set(artistId, new Set());
    this.artistMatrix.get(artistId)!.add(permission);
  }
} 