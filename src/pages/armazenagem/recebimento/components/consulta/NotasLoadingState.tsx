
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotasLoadingState: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta de Notas Fiscais</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cross-blue mx-auto mb-4"></div>
            <p>Carregando notas fiscais...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotasLoadingState;
