
import etiquetaBasicService from './etiquetaBasicService';
import etiquetaMaeService from './etiquetaMaeService';
import unitizacaoService from './unitizacaoService';
import movimentacaoService from './movimentacaoService';
import { etiquetaAtomicService } from './etiquetaAtomicService';

// Export a combined service with all functionalities
const etiquetaService = {
  ...etiquetaBasicService,
  ...etiquetaMaeService,
  ...unitizacaoService,
  ...movimentacaoService,
  ...etiquetaAtomicService,
};

// Export individual services for more granular imports
export {
  etiquetaBasicService,
  etiquetaMaeService,
  unitizacaoService,
  movimentacaoService,
  etiquetaAtomicService,
};

export default etiquetaService;
