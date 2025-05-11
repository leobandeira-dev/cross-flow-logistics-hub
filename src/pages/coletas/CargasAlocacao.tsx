
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, FileText, CheckCircle } from 'lucide-react';
import CargasPendentes from './components/CargasPendentes';
import CargasAlocadas from './components/CargasAlocadas';
import CargasFinalizadas from './components/CargasFinalizadas';
import { cargas, historicoCargas } from '../motoristas/utils/mockData';

const CargasAlocacao = () => {
  const [activeTab, setActiveTab] = useState('pendentes');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrando cargas por status
  const cargasPendentes = cargas.filter(carga => !carga.motorista || carga.status === 'pending');
  const cargasEmAndamento = cargas.filter(carga => carga.motorista && ['transit', 'loading', 'scheduled'].includes(carga.status));
  const cargasFinalizadas = [...cargas.filter(carga => ['delivered', 'problem'].includes(carga.status)), ...historicoCargas];

  return (
    <MainLayout title="Alocação de Cargas">
      <div className="mb-6">
        <div>
          <h2 className="text-xl font-heading">Gestão de Alocação de Cargas</h2>
          <p className="text-gray-500">Aloque motoristas e veículos às cargas disponíveis</p>
        </div>
      </div>
      
      <Tabs defaultValue="pendentes" className="w-full mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="pendentes" className="flex items-center">
            <Map className="mr-2 h-4 w-4" /> Cargas Pendentes
          </TabsTrigger>
          <TabsTrigger value="alocadas" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" /> Cargas Alocadas
          </TabsTrigger>
          <TabsTrigger value="finalizadas" className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" /> Cargas Finalizadas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes">
          <CargasPendentes 
            cargas={cargasPendentes} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
          />
        </TabsContent>
        
        <TabsContent value="alocadas">
          <CargasAlocadas 
            cargas={cargasEmAndamento} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
          />
        </TabsContent>

        <TabsContent value="finalizadas">
          <CargasFinalizadas 
            cargas={cargasFinalizadas} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default CargasAlocacao;
