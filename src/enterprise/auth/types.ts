export type Role = 
  | 'metadata_admin'
  | 'royalty_viewer'
  | 'legal_reviewer'
  | 'catalog_manager'
  | 'system_admin';

export type Permission = 
  | 'read_metadata'
  | 'write_metadata'
  | 'view_royalties'
  | 'manage_users'
  | 'approve_changes'
  | 'export_data';

export interface RolePermission {
  role: Role;
  permissions: Permission[];
  catalogAccess: string[];  // Catalog IDs
  projectAccess: string[];  // Project IDs
}

export interface UserRole {
  userId: string;
  roles: Role[];
  mfaEnabled: boolean;
  ssoProvider?: 'google' | 'azure' | 'okta';
} 