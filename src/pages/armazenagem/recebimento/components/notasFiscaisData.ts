
import { NotaFiscal } from '@/types/supabase/fiscal.types';

// Export the interface for other components to use
export { NotaFiscal };

// Mock data for demonstration using the correct NotaFiscal interface
export const notasFiscaisMock: NotaFiscal[] = [
  { 
    id: 'NF001', 
    numero: 'NF12345', 
    serie: '1',
    chave_acesso: '35230614200166000187550010000000011234567890',
    valor_total: 1250.00,
    peso_bruto: 15.5,
    quantidade_volumes: 2,
    data_emissao: '2023-10-15T10:30:00Z', 
    status: 'coletado', 
    tipo: 'entrada',
    created_at: '2023-10-15T10:30:00Z',
    updated_at: '2023-10-15T10:30:00Z',
    remetente: {
      id: 'emp1',
      razao_social: 'Empresa ABC Ltda',
      cnpj: '14.200.166/0001-87',
      nome_fantasia: 'Empresa ABC',
      tipo: 'fornecedor',
      status: 'ativo',
      created_at: '2023-10-15T10:30:00Z',
      updated_at: '2023-10-15T10:30:00Z'
    },
    destinatario: {
      id: 'emp2',
      razao_social: 'Indústria XYZ S.A.',
      cnpj: '25.300.277/0001-98',
      nome_fantasia: 'Indústria XYZ',
      tipo: 'cliente',
      status: 'ativo',
      created_at: '2023-10-15T10:30:00Z',
      updated_at: '2023-10-15T10:30:00Z'
    }
  },
  { 
    id: 'NF002', 
    numero: 'NF12346', 
    serie: '1',
    chave_acesso: '35230614200166000187550010000000021234567891',
    valor_total: 2150.00,
    peso_bruto: 22.3,
    quantidade_volumes: 3,
    data_emissao: '2023-10-16T14:20:00Z', 
    status: 'entregue', 
    tipo: 'entrada',
    created_at: '2023-10-16T14:20:00Z',
    updated_at: '2023-10-16T14:20:00Z',
    remetente: {
      id: 'emp3',
      razao_social: 'Empresa DEF Ltda',
      cnpj: '15.300.266/0001-76',
      nome_fantasia: 'Empresa DEF',
      tipo: 'fornecedor',
      status: 'ativo',
      created_at: '2023-10-16T14:20:00Z',
      updated_at: '2023-10-16T14:20:00Z'
    },
    destinatario: {
      id: 'emp4',
      razao_social: 'Comércio XYZ Ltda',
      cnpj: '26.400.377/0001-87',
      nome_fantasia: 'Comércio XYZ',
      tipo: 'cliente',
      status: 'ativo',
      created_at: '2023-10-16T14:20:00Z',
      updated_at: '2023-10-16T14:20:00Z'
    }
  },
  { 
    id: 'NF003', 
    numero: 'NF12347', 
    serie: '2',
    chave_acesso: '35230614200166000187550020000000031234567892',
    valor_total: 3450.00,
    peso_bruto: 45.8,
    quantidade_volumes: 5,
    data_emissao: '2023-10-17T09:15:00Z', 
    status: 'no_armazem', 
    tipo: 'entrada',
    created_at: '2023-10-17T09:15:00Z',
    updated_at: '2023-10-17T09:15:00Z',
    remetente: {
      id: 'emp5',
      razao_social: 'Empresa GHI S.A.',
      cnpj: '17.500.466/0001-65',
      nome_fantasia: 'Empresa GHI',
      tipo: 'fornecedor',
      status: 'ativo',
      created_at: '2023-10-17T09:15:00Z',
      updated_at: '2023-10-17T09:15:00Z'
    },
    destinatario: {
      id: 'emp6',
      razao_social: 'Varejo ABC Ltda',
      cnpj: '28.600.477/0001-76',
      nome_fantasia: 'Varejo ABC',
      tipo: 'cliente',
      status: 'ativo',
      created_at: '2023-10-17T09:15:00Z',
      updated_at: '2023-10-17T09:15:00Z'
    }
  }
];
