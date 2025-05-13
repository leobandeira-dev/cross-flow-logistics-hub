
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NotaFiscal } from '../../../Faturamento';
import { useNotasImportacao } from './useNotasImportacao';
import CSVImportSection from './CSVImportSection';
import NotasTable from './NotasTable';
import TableActions from './TableActions';

interface ImportacaoLoteNotasProps {
  onImportarLote: (notas: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>[]) => void;
}

const ImportacaoLoteNotas: React.FC<ImportacaoLoteNotasProps> = ({ onImportarLote }) => {
  const {
    notasLote,
    adicionarLinha,
    atualizarNota,
    removerNota,
    importarDeCSV,
    limparTudo
  } = useNotasImportacao();
  
  // Função para importar as notas
  const importarNotas = () => {
    // Validar se todos os campos obrigatórios estão preenchidos
    const notasCompletas = notasLote.filter(nota => 
      nota.data && 
      nota.cliente && 
      nota.pesoNota && 
      nota.fretePorTonelada &&
      nota.pesoMinimo !== undefined && 
      nota.aliquotaICMS !== undefined && 
      nota.aliquotaExpresso !== undefined
    ) as Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>[];
    
    if (notasCompletas.length < notasLote.length) {
      alert('Algumas notas possuem campos obrigatórios não preenchidos!');
      return;
    }
    
    onImportarLote(notasCompletas);
    limparTudo(); // Limpa o formulário após importar
  };
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <CSVImportSection 
          onImportCSV={importarDeCSV}
          onAddLine={adicionarLinha}
        />
        
        <NotasTable
          notasLote={notasLote}
          onUpdateNota={atualizarNota}
          onRemoveNota={removerNota}
        />
        
        <TableActions
          notasCount={notasLote.length}
          onClearAll={limparTudo}
          onImportNotas={importarNotas}
        />
      </CardContent>
    </Card>
  );
};

export default ImportacaoLoteNotas;
