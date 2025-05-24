
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Printer, FileText, Loader2 } from 'lucide-react';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [tipoFilter, setTipoFilter] = useState('todos');

  const { notasFiscais, isLoading, error, refetch } = useNotasFiscais();

  // Filter notas fiscais based on search criteria
  const filteredNotas = notasFiscais.filter(nota => {
    const matchesSearch = searchTerm === '' || 
      nota.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.chave_acesso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.remetente?.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.destinatario?.razao_social?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || nota.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || nota.tipo === tipoFilter;

    return matchesSearch && matchesStatus && matchesTipo;
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

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar notas fiscais: {error.message}</p>
            <Button onClick={() => refetch()} className="mt-2">
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

          <Button onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
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
                        {nota.remetente?.razao_social || 'Não informado'}
                      </TableCell>
                      <TableCell>
                        {nota.destinatario?.razao_social || 'Não informado'}
                      </TableCell>
                      <TableCell>{formatCurrency(nota.valor_total)}</TableCell>
                      <TableCell>{formatDate(nota.data_emissao)}</TableCell>
                      <TableCell>{getStatusBadge(nota.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPrintClick(nota.id)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
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
