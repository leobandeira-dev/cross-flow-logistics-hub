
import { ModuloEmpresa } from './types';

// Mock modules similar to empresa permissions
export const systemModules: ModuloEmpresa[] = [
  {
    id: 'armazenagem',
    nome: 'Armazenagem',
    tabelas: [
      {
        id: 'recebimento',
        nome: 'Recebimento',
        rotinas: [
          { id: 'notas', nome: 'Entrada de Notas' },
          { id: 'fornecedor', nome: 'Recebimento de Fornecedor' },
          { id: 'filiais', nome: 'Recebimento de Filiais' },
          { id: 'coleta', nome: 'Recebimento de Coleta' },
          { id: 'etiquetas', nome: 'Geração de Etiquetas' },
        ]
      },
    ]
  }
];

// Mock profiles for users
export const userProfiles = [
  "Administrador",
  "Gerente",
  "Operador",
  "Visualizador"
];

// Mock users for select
export const usersMock = [
  { id: "1", nome: "João Silva", email: "joao.silva@exemplo.com", perfil: "Administrador" },
  { id: "2", nome: "Maria Oliveira", email: "maria.oliveira@exemplo.com", perfil: "Gerente" },
  { id: "3", nome: "Carlos Santos", email: "carlos.santos@exemplo.com", perfil: "Operador" },
  { id: "4", nome: "Ana Pereira", email: "ana.pereira@exemplo.com", perfil: "Visualizador" },
];
