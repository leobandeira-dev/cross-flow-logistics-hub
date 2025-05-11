
import { 
  getStandardFilters, 
  dateRangeFilterOptions, 
  getDocumentFilters 
} from '../../../../components/common/StandardFilterConfig';

const standardFilters = getStandardFilters();

export const filterConfig = [
  {
    name: 'Período',
    options: dateRangeFilterOptions
  },
  {
    name: 'Status',
    options: [
      { label: 'Todos', value: 'all' },
      { label: 'Pendentes', value: 'pending' },
      { label: 'Agendadas', value: 'scheduled' },
    ]
  },
  standardFilters.remetente,
  standardFilters.destinatario,
  standardFilters.tipoCarga,
  standardFilters.cidadeOrigem,
  standardFilters.cidadeDestino,
  getDocumentFilters('coleta'),
  getDocumentFilters('nf'),
  getDocumentFilters('pedido')
];
