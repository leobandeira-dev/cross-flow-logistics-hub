
export interface RotinaEmpresa {
  id: string;
  nome: string;
}

export interface TabelaEmpresa {
  id: string;
  nome: string;
  rotinas: RotinaEmpresa[];
}

export interface ModuloEmpresa {
  id: string;
  nome: string;
  tabelas: TabelaEmpresa[];
}

export interface UserProfile {
  id: string;
  nome: string;
  descricao?: string;
}

export interface UserPermissionProps {
  moduleId: string;
  modulePermission: boolean;
  tabId: string;
  tabPermission: boolean;
  routineId: string;
  routinePermission: boolean;
  onPermissionChange: (key: string, checked: boolean) => void;
}
