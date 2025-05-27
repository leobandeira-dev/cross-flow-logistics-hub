
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Printer, FileText, Loader2, RefreshCw, Tags } from 'lucide-react';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const navigate = useNavigate();

  // Use the filter values in the hook
  const filtrosQuery = {
    ...(statusFilter !== 'todos' && { status: statusFilter }),
    ...(tipoFilter !== 'todos' && { tipo: tipoFilter })
  };

  const { notasFiscais, isLoading, error, refetch } = useNotasFiscais(filtrosQuery);

  // Filter notas fiscais based on search criteria
  const filteredNotas = notasFiscais.filter(nota => {
    const matchesSearch = searchTerm === '' || 
      nota.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.chave_acesso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.remetente?.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.destinatario?.razao_social?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pendente': { variant: 'secondary' as const, label: 'Pendente' },
      'entrada': { variant: 'default' as const, label: 'Entrada' },
      'no_armazem': { variant: 'outline' as const, label: 'No Armazém' },
      'em_carregamento': { variant: 'default' as const, label: 'Em Carregamento' },
      'expedido': { variant: 'outline' as const, label: 'Expedido' },
      'entregue': { variant: 'outline' as const, label: 'Entregue' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const handleRefresh = () => {
    console.log('Atualizando lista de notas fiscais...');
    refetch();
  };

  const handleGenerateEtiquetas = (nota: any) => {
    console.log('Navegando para geração de etiquetas com dados da nota:', nota);
    
    // Preparar dados da nota fiscal para o formulário de etiquetas
    const notaData = {
      id: nota.id,
      numero: nota.numero,
      chave_acesso: nota.chave_acesso,
      peso_bruto: nota.peso_bruto,
      quantidade_volumes: nota.quantidade_volumes,
      valor_total: nota.valor_total,
      emitente_razao_social: nota.emitente_razao_social,
      destinatario_razao_social: nota.destinatario_razao_social,
      destinatario_cidade: nota.destinatario_cidade,
      destinatario_uf: nota.destinatario_uf,
      data_emissao: nota.data_emissao,
      // Incluir todos os dados extras
      emitente_cnpj: nota.emitente_cnpj,
      emitente_telefone: nota.emitente_telefone,
      emitente_cidade: nota.emitente_cidade,
      emitente_bairro: nota.emitente_bairro,
      emitente_endereco: nota.emitente_endereco,
      emitente_numero: nota.emitente_numero,
      emitente_cep: nota.emitente_cep,
      emitente_uf: nota.emitente_uf,
      destinatario_cnpj: nota.destinatario_cnpj,
      destinatario_telefone: nota.destinatario_telefone,
      destinatario_bairro: nota.destinatario_bairro,
      destinatario_endereco: nota.destinatario_endereco,
      destinatario_numero: nota.destinatario_numero,
      destinatario_cep: nota.destinatario_cep,
      numero_pedido: nota.numero_pedido,
      informacoes_complementares: nota.informacoes_complementares
    };

    // Navegar para a página de etiquetas com os dados da nota
    navigate('/armazenagem/recebimento/etiquetas', {
      state: {
        activeTab: 'gerar',
        notaFiscalData: notaData,
        autoGenerate: true
      }
    });
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar notas fiscais: {error.message}</p>
            <Button onClick={handleRefresh} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 text-cross-blue" size={20} />
          Consulta de Notas Fiscais
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por número, chave ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="no_armazem">No Armazém</SelectItem>
              <SelectItem value="em_carregamento">Em Carregamento</SelectItem>
              <SelectItem value="expedido">Expedido</SelectItem>
              <SelectItem value="entregue">Entregue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="saida">Saída</SelectItem>
              <SelectItem value="transferencia">Transferência</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Atualizar
          </Button>
        </div>

        {/* Tabela de Notas Fiscais */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Remetente</TableHead>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos' 
                        ? 'Nenhuma nota fiscal encontrada com os filtros aplicados.' 
                        : 'Nenhuma nota fiscal cadastrada.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotas.map((nota) => (
                    <TableRow key={nota.id}>
                      <TableCell className="font-medium">{nota.numero}</TableCell>
                      <TableCell>{nota.serie || '-'}</TableCell>
                      <TableCell>
                        {nota.remetente?.razao_social || nota.emitente_razao_social || 'Não informado'}
                      </TableCell>
                      <TableCell>
                        {nota.destinatario?.razao_social || nota.destinatario_razao_social || 'Não informado'}
                      </TableCell>
                      <TableCell>{formatCurrency(nota.valor_total)}</TableCell>
                      <TableCell>{formatDate(nota.data_emissao)}</TableCell>
                      <TableCell>{getStatusBadge(nota.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPrintClick(nota.id)}
                            title="Imprimir nota fiscal"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateEtiquetas(nota)}
                            title="Gerar etiquetas"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Tags className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          Total de registros: {filteredNotas.length}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultaNotas;
