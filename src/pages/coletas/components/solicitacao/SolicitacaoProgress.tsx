
import React from 'react';
import { SolicitacaoProgressProps } from './SolicitacaoTypes';

const SolicitacaoProgress: React.FC<SolicitacaoProgressProps> = ({ 
  currentStep,
  onNext,
  onPrev 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-cross-blue' : 'text-gray-400'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-cross-blue bg-cross-blue text-white' : 'border-gray-300'}`}>
            1
          </div>
          <span className="text-xs mt-1">Notas Fiscais</span>
        </div>
        
        <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 2 ? 'bg-cross-blue' : 'bg-gray-300'}`}></div>
        
        <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-cross-blue' : 'text-gray-400'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-cross-blue bg-cross-blue text-white' : 'border-gray-300'}`}>
            2
          </div>
          <span className="text-xs mt-1">Confirmação</span>
        </div>
      </div>
    </div>
  );
};

export default SolicitacaoProgress;
