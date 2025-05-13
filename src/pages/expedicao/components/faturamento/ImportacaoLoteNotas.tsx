
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotaFiscal } from '../../Faturamento';
import { useNotasImportacao } from './importacao/useNotasImportacao';
import CSVImportSection from './importacao/CSVImportSection';
import NotasTable from './importacao/NotasTable';
import TableActions from './importacao/TableActions';
import ImportarNotasExistentes from './importacao/ImportarNotasExistentes';
import ImportarOrdemCarregamento from './ImportarOrdemCarregamento';

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
    limparTudo,
    setNotasLote
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

  // Função para lidar com a importação de notas existentes
  const handleImportarNotasExistentes = (notas: Partial<NotaFiscal>[]) => {
    setNotasLote([...notasLote, ...notas]);
  };

  // Função para importar notas da ordem de carregamento com conversão de datas
  const handleImportarNotasOrdemCarregamento = (notas: any[], ocId: string) => {
    // Converter dataEmissao de string para Date quando existir
    const notasConvertidas: Partial<NotaFiscal>[] = notas.map(nota => ({
      ...nota,
      dataEmissao: nota.dataEmissao ? new Date(nota.dataEmissao) : undefined
    }));
    
    handleImportarNotasExistentes(notasConvertidas);
  };

  // Função para atualizar valores de cabeçalho (usado pela ordem de carregamento)
  const handleUpdateCabecalho = (cabecalhoValores: any) => {
    // Atualiza todas as notas no lote com os novos valores do cabeçalho
    const notasAtualizadas = notasLote.map(nota => ({
      ...nota,
      fretePorTonelada: cabecalhoValores.fretePorTonelada,
      pesoMinimo: cabecalhoValores.pesoMinimo,
      aliquotaICMS: cabecalhoValores.aliquotaICMS,
      aliquotaExpresso: cabecalhoValores.aliquotaExpresso,
      valorFreteTransferencia: cabecalhoValores.valorFreteTransferencia,
      valorColeta: cabecalhoValores.valorColeta,
      paletizacao: cabecalhoValores.paletizacao,
      pedagio: cabecalhoValores.pedagio
    }));
    
    setNotasLote(notasAtualizadas);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="manual">Entrada Manual / CSV</TabsTrigger>
            <TabsTrigger value="existentes">Importar Notas Existentes</TabsTrigger>
            <TabsTrigger value="ordemcarregamento">Importar de OC</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <CSVImportSection 
              onImportCSV={importarDeCSV}
              onAddLine={adicionarLinha}
            />
          </TabsContent>
          
          <TabsContent value="existentes">
            <ImportarNotasExistentes 
              onImportarNotas={handleImportarNotasExistentes} 
            />
          </TabsContent>
          
          <TabsContent value="ordemcarregamento">
            <ImportarOrdemCarregamento 
              onImportarNotasOrdemCarregamento={handleImportarNotasOrdemCarregamento}
              onUpdateCabecalho={handleUpdateCabecalho}
              cabecalhoValores={{
                fretePorTonelada: 0,
                pesoMinimo: 0,
                aliquotaICMS: 0,
                aliquotaExpresso: 0,
                valorFreteTransferencia: 0,
                valorColeta: 0,
                paletizacao: 0,
                pedagio: 0
              }}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportacaoLoteNotas;
