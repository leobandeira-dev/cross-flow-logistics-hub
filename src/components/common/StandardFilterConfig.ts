
import { subDays, startOfMonth, endOfMonth, format } from 'date-fns';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  name: string;
  options: FilterOption[];
}

// Helper function to get date ranges
export const getDateRanges = () => {
  const today = new Date();
  const last7Days = {
    from: subDays(today, 7),
    to: today
  };
  const last30Days = {
    from: subDays(today, 30),
    to: today
  };
  const currentMonth = {
    from: startOfMonth(today),
    to: endOfMonth(today)
  };

  return {
    last7Days,
    last30Days,
    currentMonth,
    formatDate: (date: Date) => format(date, 'yyyy-MM-dd')
  };
};

// Standard date range filter options
export const dateRangeFilterOptions: FilterOption[] = [
  { label: 'Últimos 7 dias', value: 'last7Days' },
  { label: 'Últimos 30 dias', value: 'last30Days' },
  { label: 'Mês atual', value: 'currentMonth' },
  { label: 'Personalizado', value: 'custom' }
];

// Standard filter configurations that can be used across the application
export const getStandardFilters = () => {
  return {
    remetente: {
      name: 'Remetente',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'MegaCorp LTDA', value: 'megacorp' },
        { label: 'TechSolutions S.A.', value: 'techsolutions' },
        { label: 'Indústria ABC', value: 'abc' },
        { label: 'Comércio Global', value: 'global' }
      ]
    },
    destinatario: {
      name: 'Destinatário',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Varejo Nacional', value: 'varejo' },
        { label: 'Distribuidor XYZ', value: 'xyz' },
        { label: 'Rede Mercados', value: 'mercados' },
        { label: 'Loja Central', value: 'central' }
      ]
    },
    motorista: {
      name: 'Motorista',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'José da Silva', value: 'jose' },
        { label: 'Carlos Santos', value: 'carlos' },
        { label: 'Pedro Oliveira', value: 'pedro' },
        { label: 'Antônio Ferreira', value: 'antonio' },
        { label: 'Manuel Costa', value: 'manuel' }
      ]
    },
    tipoCarga: {
      name: 'Tipo de Carga',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Fracionado', value: 'fracionado' },
        { label: 'Lotação', value: 'lotacao' }
      ]
    },
    cidadeOrigem: {
      name: 'Cidade Origem',
      options: [
        { label: 'Todas', value: 'all' },
        { label: 'São Paulo', value: 'sp' },
        { label: 'Rio de Janeiro', value: 'rj' },
        { label: 'Belo Horizonte', value: 'bh' },
        { label: 'Curitiba', value: 'curitiba' },
        { label: 'Porto Alegre', value: 'poa' }
      ]
    },
    cidadeDestino: {
      name: 'Cidade Destino',
      options: [
        { label: 'Todas', value: 'all' },
        { label: 'São Paulo', value: 'sp' },
        { label: 'Rio de Janeiro', value: 'rj' },
        { label: 'Belo Horizonte', value: 'bh' },
        { label: 'Curitiba', value: 'curitiba' },
        { label: 'Porto Alegre', value: 'poa' }
      ]
    }
  };
};

// Generate document-specific filters
export const getDocumentFilters = (documentType: 'coleta' | 'cte' | 'nf' | 'pedido' | 'romaneio') => {
  switch (documentType) {
    case 'coleta':
      return {
        name: 'Nº CT-e de Coleta',
        options: [
          { label: 'Todos', value: 'all' },
          { label: 'Buscar por número', value: 'search' }
        ]
      };
    case 'cte':
      return {
        name: 'Nº CT-e de Viagem',
        options: [
          { label: 'Todos', value: 'all' },
          { label: 'Buscar por número', value: 'search' }
        ]
      };
    case 'nf':
      return {
        name: 'Nº Nota Fiscal',
        options: [
          { label: 'Todos', value: 'all' },
          { label: 'Buscar por número', value: 'search' }
        ]
      };
    case 'pedido':
      return {
        name: 'Nº Pedido',
        options: [
          { label: 'Todos', value: 'all' },
          { label: 'Buscar por número', value: 'search' }
        ]
      };
    case 'romaneio':
      return {
        name: 'Nº Romaneio',
        options: [
          { label: 'Todos', value: 'all' },
          { label: 'Buscar por número', value: 'search' }
        ]
      };
    default:
      return {
        name: 'Documento',
        options: [
          { label: 'Todos', value: 'all' },
          { label: 'Buscar por número', value: 'search' }
        ]
      };
  }
};
