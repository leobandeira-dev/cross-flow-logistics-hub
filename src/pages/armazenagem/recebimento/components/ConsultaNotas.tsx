
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Printer, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { buscarNotasFiscais } from '@/services/notaFiscal/fetchNotaFiscalService';

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const { data: notasFiscais = [], isLoading } = useQuery({
    queryKey: ['notas-fiscais-consulta'],
    queryFn: () => buscarNotasFiscais({ status: 'entrada' })
  });

  const filteredNotas = notasFiscais.filter(nota => 
    nota.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nota.emitente_razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nota.destinatario_razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nota.chave_acesso?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateEtiquetas = (nota: any) => {
    // Prepare nota fiscal data for etiqueta generation
    const notaFiscalData = {
      notaFiscal: nota.numero,
      volumesTotal: nota.quantidade_volumes,
      pesoTotal: nota.peso_bruto,
      remetente: nota.emitente_razao_social,
      destinatario: nota.destinatario_razao_social,
      endereco: `${nota.destinatario_endereco || ''}, ${nota.destinatario_numero || ''} - ${nota.destinatario_bairro || ''}`,
      cidade: nota.destinatario_cidade,
      uf: nota.destinatario_uf,
      chaveNF: nota.chave_acesso,
      valorTotal: nota.valor_total,
      transportadora: nota.transportadora_id || 'N/D'
    };

    // Navigate to etiquetas page with nota fiscal data
    navigate('/armazenagem/recebimento/etiquetas', {
      state: {
        notaFiscalData,
        autoGenerate: true,
        activeTab: 'gerar'
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entrada': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'processada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Search className="mr-2 text-cross-blue" size={20} />
          Consulta de Notas Fiscais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Buscar por número, chave de acesso, emitente ou destinatário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">Carregando notas fiscais...</div>
        ) : (
          <div className="space-y-4">
            {filteredNotas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma nota fiscal encontrada
              </div>
            ) : (
              filteredNotas.map((nota) => (
                <div key={nota.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText size={16} className="text-cross-blue" />
                        <span className="font-semibold">NF: {nota.numero}</span>
                        <Badge className={getStatusColor(nota.status || 'pendente')}>
                          {nota.status || 'pendente'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <strong>Emitente:</strong> {nota.emitente_razao_social || 'N/A'}
                        </div>
                        <div>
                          <strong>Destinatário:</strong> {nota.destinatario_razao_social || 'N/A'}
                        </div>
                        <div>
                          <strong>Valor:</strong> R$ {nota.valor_total?.toFixed(2) || '0,00'}
                        </div>
                        <div>
                          <strong>Volumes:</strong> {nota.quantidade_volumes || 'N/A'}
                        </div>
                        {nota.peso_bruto && (
                          <div>
                            <strong>Peso:</strong> {nota.peso_bruto} kg
                          </div>
                        )}
                        {nota.data_emissao && (
                          <div>
                            <strong>Emissão:</strong> {new Date(nota.data_emissao).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                      
                      {nota.chave_acesso && (
                        <div className="text-xs text-gray-500 mt-2">
                          <strong>Chave:</strong> {nota.chave_acesso}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateEtiquetas(nota)}
                        className="flex items-center"
                      >
                        <Tag size={16} className="mr-1" />
                        Gerar Etiquetas
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPrintClick(nota.id)}
                        className="flex items-center"
                      >
                        <Printer size={16} className="mr-1" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultaNotas;
