
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface NotaFiscalSelectorProps {
  notasFiscais: any[];
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
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 text-cross-blue" size={20} />
          Selecionar Nota Fiscal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="notaFiscalSelect">Nota Fiscal</Label>
            <Select 
              value={selectedNotaId} 
              onValueChange={onNotaSelection}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma nota fiscal..." />
              </SelectTrigger>
              <SelectContent>
                {notasFiscais.map((nota) => (
                  <SelectItem key={nota.id} value={nota.id}>
                    NF: {nota.numero} - {nota.emitente_razao_social} → {nota.destinatario_razao_social}
                    {nota.quantidade_volumes && ` (${nota.quantidade_volumes} volumes)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isLoading && (
            <div className="text-sm text-gray-500">
              Carregando notas fiscais...
            </div>
          )}
          
          {!isLoading && notasFiscais.length === 0 && (
            <div className="text-sm text-gray-500">
              Nenhuma nota fiscal encontrada. Cadastre uma nota fiscal primeiro.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotaFiscalSelector;
