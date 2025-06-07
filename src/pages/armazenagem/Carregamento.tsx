
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Truck, FileText, Box, Package } from 'lucide-react';

const Carregamento: React.FC = () => {
  return (
    <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Carregamento</h2>
        <p className="text-gray-600">Gerencie operações de carregamento de mercadorias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <Link to="/armazenagem/carregamento/ordem">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 text-cross-blue" size={20} />
                Ordem de Carregamento (OC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Crie e gerencie ordens de carregamento
              </p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <Link to="/armazenagem/carregamento/conferencia">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 text-cross-blue" size={20} />
                Conferência de Carga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Confira volumes, notas fiscais ou etiquetas mãe
              </p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <Link to="/armazenagem/carregamento/enderecamento">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Truck className="mr-2 text-cross-blue" size={20} />
                Endereçamento no Caminhão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Organize o layout de carregamento no caminhão
              </p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <Link to="/armazenagem/carregamento/checklist">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 text-cross-blue" size={20} />
                Checklist com Registro Fotográfico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Documente o carregamento com checklist e fotos
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral de Carregamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Selecione uma das opções acima para gerenciar operações de carregamento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Carregamento;
