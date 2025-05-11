
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  active: boolean;
  completed: boolean;
  number: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ active, completed, number }) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm transition-all",
        active ? "border-cross-blue bg-cross-blue text-white" : 
        completed ? "border-green-500 bg-green-500 text-white" : 
        "border-gray-300 text-gray-500"
      )}
    >
      {completed ? <Check size={16} className="text-white" /> : number}
    </div>
  );
};

interface SolicitacaoProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const SolicitacaoProgress: React.FC<SolicitacaoProgressProps> = ({ currentStep, totalSteps = 3 }) => {
  const progressPercentage = ((currentStep) / totalSteps) * 100;
  
  // Step labels
  const steps = [
    "Informações Básicas",
    "Notas Fiscais",
    "Confirmação"
  ];
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2 relative">
        {/* Progress line connecting steps */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10"></div>
        
        {/* Progress line showing completed steps */}
        <div 
          className="absolute top-4 left-4 h-0.5 bg-green-500 -z-10 transition-all duration-300" 
          style={{width: `${Math.max(0, (currentStep - 1) / (steps.length - 1) * 100)}%`}}
        ></div>
        
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <StepIndicator 
              active={currentStep === index + 1}
              completed={currentStep > index + 1}
              number={index + 1}
            />
            <span className={cn(
              "text-xs mt-1",
              currentStep === index + 1 ? "text-cross-blue font-medium" : 
              currentStep > index + 1 ? "text-green-500" : "text-gray-500"
            )}>
              {step}
            </span>
          </div>
        ))}
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default SolicitacaoProgress;
