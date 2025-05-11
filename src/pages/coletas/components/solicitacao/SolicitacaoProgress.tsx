
import React from 'react';

interface SolicitacaoProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const SolicitacaoProgress: React.FC<SolicitacaoProgressProps> = ({ currentStep, totalSteps = 2 }) => {
  const steps = [
    { number: 1, title: "Notas Fiscais" },
    { number: 2, title: "Confirmação" }
  ];

  return (
    <div className="my-4">
      <div className="flex justify-between mb-2">
        {steps.map((step) => (
          <div 
            key={step.number}
            className="flex flex-col items-center space-y-1 flex-1"
          >
            <div 
              className={`
                h-8 w-8 rounded-full flex items-center justify-center
                ${currentStep >= step.number 
                  ? 'bg-cross-blue text-white' 
                  : 'bg-gray-100 text-gray-400'}
              `}
            >
              {step.number}
            </div>
            <span 
              className={`text-sm ${currentStep >= step.number 
                ? 'text-cross-blue font-medium' 
                : 'text-gray-400'}`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
        <div 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cross-blue transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default SolicitacaoProgress;
