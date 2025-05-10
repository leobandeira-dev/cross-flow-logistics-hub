
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, FileText } from 'lucide-react';
import CargasPendentes from './components/CargasPendentes';
import CargasAlocadas from './components/CargasAlocadas';
import { cargas, historicoCargas } from '../motoristas/utils/mockData';

const CargasAlocacao = () => {
  const [activeTab, setActiveTab] = useState('pendentes');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <MainLayout title="Alocação de Cargas">
      <div className="mb-6">
        <div>
          <h2 className="text-xl font-heading">Gestão de Alocação de Cargas</h2>
          <p className="text-gray-500">Aloque motoristas e veículos às cargas disponíveis</p>
        </div>
      </div>
      
      <Tabs defaultValue="pendentes" className="w-full mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pendentes" className="flex items-center">
            <Map className="mr-2 h-4 w-4" /> Cargas Pendentes
          </TabsTrigger>
          <TabsTrigger value="alocadas" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" /> Cargas Alocadas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes">
          <CargasPendentes 
            cargas={cargas.filter(carga => !carga.motorista || carga.status === 'pending')} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
          />
        </TabsContent>
        
        <TabsContent value="alocadas">
          <CargasAlocadas 
            cargas={[...cargas.filter(carga => carga.motorista && carga.status !== 'pending'), ...historicoCargas]} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default CargasAlocacao;
