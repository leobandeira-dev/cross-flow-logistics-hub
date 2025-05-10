
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleWhatsAppSupport } from '../motoristas/utils/supportHelpers';
import CargasPendentes from './components/CargasPendentes';
import CargasAlocadas from './components/CargasAlocadas';
import { cargas, historicoCargas } from '../motoristas/utils/mockData';

const CargasAlocacao = () => {
  const [activeTab, setActiveTab] = useState('pendentes');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <MainLayout title="Alocação de Cargas">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading">Gestão de Alocação de Cargas</h2>
          <p className="text-gray-500">Aloque motoristas e veículos às cargas disponíveis</p>
        </div>
        <Button 
          onClick={handleWhatsAppSupport}
          variant="outline"
          className="bg-green-500 hover:bg-green-600 text-white border-none"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2 h-4 w-4"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M9 14a5 5 0 0 0 6 0" />
          </svg>
          Suporte via WhatsApp
        </Button>
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
