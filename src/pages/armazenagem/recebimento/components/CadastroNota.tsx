
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import NotaFiscalForm from './NotaFiscalForm';

const CadastroNota: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 text-cross-blue" size={20} />
          Cadastro de Nota Fiscal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NotaFiscalForm />
      </CardContent>
    </Card>
  );
};

export default CadastroNota;
