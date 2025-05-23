
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Printer, Eye, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { buscarNotasFiscais } from '@/services/notaFiscal/fetchNotaFiscalService';
import { excluirNotaFiscal } from '@/services/notaFiscal/deleteNotaFiscalService';
import { NotaFiscal } from '@/types/supabase.types';

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [filtros, setFiltros] = useState({
    termo: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load notas fiscais on component mount
  useEffect(() => {
    carregarNotas();
  }, []);

  const carregarNotas = async () => {
    setIsLoading(true);
    try {
      const notasCarregadas = await buscarNotasFiscais(filtros);
      setNotas(notasCarregadas);
      console.log('Notas fiscais carregadas:', notasCarregadas);
    } catch (error: any) {
      console.error('Erro ao carregar notas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar notas fiscais",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltrar = () => {
    carregarNotas();
  };

  const handleExcluir = async (notaId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
      return;
    }

    try {
      await excluirNotaFiscal(notaId);
      toast({
        title: "Sucesso",
        description: "Nota fiscal excluída com sucesso",
      });
      carregarNotas(); // Reload list
    } catch (error: any) {
      console.error('Erro ao excluir nota:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir nota fiscal",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      entrada: { variant: 'default' as const, label: 'Entrada' },
      processando: { variant: 'secondary' as const, label: 'Processando' },
      concluida: { variant: 'default' as const, label: 'Concluída' },
      pendente: { variant: 'destructive' as const, label: 'Pendente' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'default' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Search className="mr-2 text-cross-blue" size={20} />
          Consultar Notas Fiscais
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Buscar por número, chave ou fornecedor..."
            value={filtros.termo}
            onChange={(e) => setFiltros({ ...filtros, termo: e.target.value })}
          />
          
          <Select value={filtros.status} onValueChange={(value) => setFiltros({ ...filtros, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="processando">Processando</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="date"
            placeholder="Data inicial"
            value={filtros.dataInicio}
            onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
          />
          
          <Input
            type="date"
            placeholder="Data final"
            value={filtros.dataFim}
            onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
          />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleFiltrar} disabled={isLoading}>
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? 'Carregando...' : 'Filtrar'}
          </Button>
          
          <div className="text-sm text-gray-600">
            {notas.length} nota(s) encontrada(s)
          </div>
        </div>

        {/* Lista de Notas */}
        <div className="space-y-4">
          {notas.map((nota) => (
            <Card key={nota.id} className="border-l-4 border-l-cross-blue">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <FileText className="mr-2 h-4 w-4 text-cross-blue" />
                      <span className="font-semibold">NF: {nota.numero}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Série: {nota.serie || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Chave: {nota.chave_acesso ? `${nota.chave_acesso.substring(0, 20)}...` : 'N/A'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Valor Total</div>
                    <div className="font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(nota.valor || 0)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Peso: {nota.peso_bruto || 0} kg
                    </div>
                    <div className="text-sm text-gray-600">
                      Volumes: {nota.quantidade_volumes || 0}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Data Emissão</div>
                    <div className="font-semibold">
                      {nota.data_emissao ? new Date(nota.data_emissao).toLocaleDateString('pt-BR') : 'N/A'}
                    </div>
                    <div className="mt-1">
                      {getStatusBadge(nota.status)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPrintClick(nota.id)}
                      className="flex items-center"
                    >
                      <Printer className="mr-1 h-3 w-3" />
                      Imprimir
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Navigate to etiquetas with this nota fiscal data
                        window.location.href = `/armazenagem/recebimento/etiquetas?nota=${nota.id}`;
                      }}
                      className="flex items-center"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Etiquetas
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleExcluir(nota.id)}
                      className="flex items-center"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Excluir
                    </Button>
                  </div>
                </div>
                
                {nota.observacoes && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-gray-600">Observações:</div>
                    <div className="text-sm">{nota.observacoes}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {notas.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma nota fiscal encontrada
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultaNotas;
