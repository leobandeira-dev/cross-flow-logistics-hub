
import React from 'react';
import { Card } from '@/components/ui/card';
import NotaFiscalForm from './NotaFiscalForm';

const CadastroNota: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cadastro de Nota Fiscal</h2>
      <NotaFiscalForm />
    </Card>
  );
};

export default CadastroNota;
