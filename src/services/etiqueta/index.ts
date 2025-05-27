
import etiquetaBasicService from './etiquetaBasicService';
import etiquetaMaeService from './etiquetaMaeService';
import unitizacaoService from './unitizacaoService';
import movimentacaoService from './movimentacaoService';
import etiquetaCrudService from './etiquetaCrudService';

// Export a combined service with all functionalities
const etiquetaService = {
  ...etiquetaBasicService,
  ...etiquetaMaeService,
  ...unitizacaoService,
  ...movimentacaoService,
  ...etiquetaCrudService,
};

// Export individual services for more granular imports
export {
  etiquetaBasicService,
  etiquetaMaeService,
  unitizacaoService,
  movimentacaoService,
  etiquetaCrudService,
};

export default etiquetaService;
