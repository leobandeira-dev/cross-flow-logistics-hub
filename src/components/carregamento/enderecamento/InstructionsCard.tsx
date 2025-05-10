
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InstructionsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Instruções de Carregamento</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-1 text-gray-600">
          <li>• Volumes frágeis devem ser posicionados por último e no topo</li>
          <li>• Volumes mais pesados devem ficar na parte inferior</li>
          <li>• Volumes maiores devem ser carregados primeiro</li>
          <li>• Verificar a distribuição de peso entre os eixos</li>
          <li>• Respeitar a capacidade máxima de peso por zona</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default InstructionsCard;
