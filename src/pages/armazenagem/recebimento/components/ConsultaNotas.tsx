
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, FileText, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatusBadge from './StatusBadge';
import { notasFiscaisMock } from './notasFiscaisData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConsultaNotasProps {
  onPrintClick?: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');

  const filteredNotas = useMemo(() => {
    return notasFiscaisMock.filter(nota => {
      const matchesSearch = nota.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nota.chave_acesso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nota.remetente?.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nota.destinatario?.razao_social?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'todos' || nota.status === statusFilter;
      const matchesTipo = tipoFilter === 'todos' || nota.tipo === tipoFilter;
      
      return matchesSearch && matchesStatus && matchesTipo;
    });
  }, [searchTerm, statusFilter, tipoFilter]);

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar nota fiscal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_transito">Em Trânsito</SelectItem>
              <SelectItem value="entregue">Entregue</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="saida">Saída</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Notas Fiscais ({filteredNotas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Remetente</TableHead>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Peso (kg)</TableHead>
                  <TableHead>Volumes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotas.map((nota) => (
                  <TableRow key={nota.id}>
                    <TableCell className="font-medium">{nota.numero}</TableCell>
                    <TableCell>{nota.serie || '-'}</TableCell>
                    <TableCell>{formatDate(nota.data_emissao)}</TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={nota.remetente?.razao_social}>
                        {nota.remetente?.razao_social || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={nota.destinatario?.razao_social}>
                        {nota.destinatario?.razao_social || '-'}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(nota.valor_total)}</TableCell>
                    <TableCell>{nota.peso_bruto ? `${nota.peso_bruto} kg` : '-'}</TableCell>
                    <TableCell>{nota.quantidade_volumes || '-'}</TableCell>
                    <TableCell>
                      <StatusBadge status={nota.status} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {nota.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onPrintClick && onPrintClick(nota.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultaNotas;
