
import React from 'react';
import EmpresasListTab from '../EmpresasListTab';

interface EmpresasListTabWrapperProps {
  empresas: any[];
  isLoading: boolean;
  onViewDetails: (empresa: any) => void;
}

const EmpresasListTabWrapper: React.FC<EmpresasListTabWrapperProps> = ({ 
  empresas, 
  isLoading, 
  onViewDetails 
}) => {
  return (
    <EmpresasListTab 
      empresas={empresas}
      isLoading={isLoading}
      onViewDetails={onViewDetails}
    />
  );
};

export default EmpresasListTabWrapper;
