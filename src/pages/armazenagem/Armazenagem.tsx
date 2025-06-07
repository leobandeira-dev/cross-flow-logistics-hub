import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Box, Archive, Truck } from 'lucide-react';

const Armazenagem: React.FC = () => {
  return (
    <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Módulo de Armazenagem</h2>
        <p className="text-gray-600">Gerencie recebimentos, movimentações internas e carregamentos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <Link to="/armazenagem/recebimento">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Box className="mr-2 text-cross-blue" size={20} />
                Recebimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Processar recebimentos e entrada de mercadorias
              </p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <Link to="/armazenagem/movimentacoes">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Archive className="mr-2 text-cross-blue" size={20} />
                Movimentações Internas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Gerenciar movimentações dentro do armazém
              </p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <Link to="/armazenagem/carregamento">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Truck className="mr-2 text-cross-blue" size={20} />
                Carregamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Gerenciar operações de carregamento
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
  );
};

export default Armazenagem;
