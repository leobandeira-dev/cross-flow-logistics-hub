
import React from 'react';
import { cn } from '@/lib/utils';
import { SolicitacaoProgressProps } from './SolicitacaoTypes';

const SolicitacaoProgress: React.FC<SolicitacaoProgressProps> = ({
  currentStep,
  onNext,
  onPrev
}) => {
  const steps = [
    { id: 1, name: 'Notas Fiscais' },
    { id: 2, name: 'Confirmação' },
  ];

  return (
    <nav aria-label="Progress" className="mb-4">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn(
            stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
            'relative flex-1'
          )}>
            <div className="flex items-center">
              <div className={cn(
                step.id <= currentStep ? 'bg-cross-blue' : 'bg-gray-300',
                'h-8 w-8 flex items-center justify-center rounded-full text-white text-sm font-medium'
              )}>
                {step.id}
              </div>
              <div className={cn(
                stepIdx !== steps.length - 1 ? 'ml-4' : '',
                'text-sm font-medium ml-2'
              )}>
                {step.name}
              </div>
            </div>
            {stepIdx !== steps.length - 1 ? (
              <div className={cn(
                'absolute top-4 left-0 w-full flex items-center',
                'translate-x-8 sm:translate-x-20'
              )}>
                <div className={cn(
                  step.id < currentStep ? 'bg-cross-blue' : 'bg-gray-300',
                  'h-0.5 w-full'
                )} />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default SolicitacaoProgress;
