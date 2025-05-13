
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onReset: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ onReset }) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onReset}>Limpar</Button>
      <Button type="submit">Adicionar Nota Fiscal</Button>
    </div>
  );
};

export default FormActions;
