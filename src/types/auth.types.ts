export type UserRole = 
  | 'ADMIN'
  | 'GERENTE'
  | 'SUPERVISOR'
  | 'OPERADOR'
  | 'CLIENTE'
  | 'VISITANTE';

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface RolePermission {
  role: UserRole;
  permissions: string[]; // IDs das permissões
}

export interface UserPermissions {
  userId: string;
  role: UserRole;
  customPermissions?: string[]; // Permissões específicas do usuário
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'ADMIN': 100,
  'GERENTE': 80,
  'SUPERVISOR': 60,
  'OPERADOR': 40,
  'CLIENTE': 20,
  'VISITANTE': 10
};

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'ADMIN': ['*'], // Todas as permissões
  'GERENTE': [
    'users.view',
    'users.create',
    'users.edit',
    'reports.view',
    'reports.create',
    'operations.manage'
  ],
  'SUPERVISOR': [
    'users.view',
    'reports.view',
    'operations.view',
    'operations.edit'
  ],
  'OPERADOR': [
    'operations.view',
    'operations.execute'
  ],
  'CLIENTE': [
    'orders.view',
    'reports.view.own'
  ],
  'VISITANTE': [
    'public.view'
  ]
}; 