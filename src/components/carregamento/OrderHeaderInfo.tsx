
import React from 'react';
import { OrdemCarregamento } from './types/order.types';

interface OrderHeaderInfoProps {
  ordem: OrdemCarregamento;
}

const OrderHeaderInfo: React.FC<OrderHeaderInfoProps> = ({ ordem }) => {
  const renderConferenteInfo = () => {
    if (!ordem.conferenteResponsavel) return null;
    
    return (
      <div className="text-sm text-gray-500 mt-1">
        Conferente: {ordem.conferenteResponsavel}
      </div>
    );
  };

  const renderTimingInfo = () => {
    if (!ordem.inicioConferencia) return null;
    
    return (
      <div className="text-sm text-gray-500 mt-1">
        {ordem.inicioConferencia && `Início: ${ordem.inicioConferencia}`}
        {ordem.fimConferencia && ` • Fim: ${ordem.fimConferencia}`}
      </div>
    );
  };
  
  return (
    <>
      {renderConferenteInfo()}
      {renderTimingInfo()}
    </>
  );
};

export default OrderHeaderInfo;
