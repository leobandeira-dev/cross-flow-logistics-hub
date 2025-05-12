
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SearchFilter from '../../components/common/SearchFilter';
import { useToast } from '@/hooks/use-toast';
import { SolicitacaoColeta } from './types/coleta.types';
import EditSolicitacaoDialog from './components/EditSolicitacaoDialog';
import NovaSolicitacaoDialog from './components/NovaSolicitacaoDialog';
import TabelaSolicitacoes from './components/TabelaSolicitacoes';
import { solicitacoesIniciais } from './data/solicitacoesMock';

const SolicitacoesColeta = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('unica');
  const [currentPage, setCurrentPage] = useState(1);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoColeta[]>(solicitacoesIniciais);
  const [editingSolicitacao, setEditingSolicitacao] = useState<SolicitacaoColeta | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  const filters = [
    {
      name: 'Status',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Pendentes', value: 'pending' },
        { label: 'Aprovados', value: 'approved' },
        { label: 'Recusados', value: 'rejected' },
      ]
    },
    {
      name: 'Data',
      options: [
        { label: 'Hoje', value: 'today' },
        { label: 'Últimos 7 dias', value: '7days' },
        { label: 'Últimos 30 dias', value: '30days' },
        { label: 'Personalizado', value: 'custom' },
      ]
    }
  ];
  
  const handleSearch = (value: string) => {
    console.log('Search:', value);
    // Implementar lógica de busca
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    console.log(`Filter ${filter} changed to ${value}`);
    // Implementar lógica de filtro
  };
  
  const handleRowClick = (row: SolicitacaoColeta) => {
    console.log('Row clicked:', row);
    setEditingSolicitacao(row);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveSolicitacao = (updatedSolicitacao: SolicitacaoColeta) => {
    // Atualizar a solicitação na lista
    setSolicitacoes(prev => 
      prev.map(sol => 
        sol.id === updatedSolicitacao.id ? updatedSolicitacao : sol
      )
    );
    
    toast({
      title: "Solicitação atualizada",
      description: `A solicitação ${updatedSolicitacao.id} foi atualizada com sucesso.`
    });
  };

  return (
    <MainLayout title="Solicitações de Coleta">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading">Gestão de Solicitações</h2>
          <p className="text-gray-500">Visualize e gerencie todas as solicitações de coleta</p>
        </div>
        
        <NovaSolicitacaoDialog 
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      
      <SearchFilter 
        placeholder="Buscar por ID, remetente, destinatário ou notas fiscais..."
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <TabelaSolicitacoes
        solicitacoes={solicitacoes}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleRowClick={handleRowClick}
        itemsPerPage={itemsPerPage}
      />
      
      {/* Diálogo de Edição de Solicitação */}
      <EditSolicitacaoDialog
        solicitacao={editingSolicitacao}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveSolicitacao}
      />
    </MainLayout>
  );
};

export default SolicitacoesColeta;
