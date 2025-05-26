
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, FileText, Scale } from 'lucide-react';
import { NotaFiscal } from '@/types/supabase/fiscal.types';

interface NotaFiscalSelectorProps {
  notasFiscais: NotaFiscal[];
  selectedNotaId: string;
  onNotaSelection: (notaId: string) => void;
  isLoading?: boolean;
}

const NotaFiscalSelector: React.FC<NotaFiscalSelectorProps> = ({
  notasFiscais,
  selectedNotaId,
  onNotaSelection,
  isLoading = false
}) => {
  const selectedNota = notasFiscais.find(nota => nota.id === selectedNotaId);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Selecionar Nota Fiscal Importada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Notas Fiscais Disponíveis ({notasFiscais.length})
            </label>
            <Select value={selectedNotaId} onValueChange={onNotaSelection}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={
                  isLoading ? "Carregando notas fiscais..." : "Selecione uma nota fiscal importada"
                } />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Carregando...
                    </div>
                  </SelectItem>
                ) : notasFiscais.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    Nenhuma nota fiscal encontrada
                  </SelectItem>
                ) : (
                  notasFiscais.map((nota) => (
                    <SelectItem key={nota.id} value={nota.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>NF: {nota.numero} - Série: {nota.serie}</span>
                        <div className="flex gap-1 ml-2">
                          <Badge variant="secondary" className="text-xs">
                            R$ {nota.valor_total?.toFixed(2)}
                          </Badge>
                          {nota.quantidade_volumes && (
                            <Badge variant="outline" className="text-xs">
                              {nota.quantidade_volumes} vol.
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedNota && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Nota Fiscal</p>
                  <p className="font-medium">{selectedNota.numero}/{selectedNota.serie}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Volumes</p>
                  <p className="font-medium">{selectedNota.quantidade_volumes || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Peso Bruto</p>
                  <p className="font-medium">{selectedNota.peso_bruto ? `${selectedNota.peso_bruto} kg` : 'Não informado'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotaFiscalSelector;
