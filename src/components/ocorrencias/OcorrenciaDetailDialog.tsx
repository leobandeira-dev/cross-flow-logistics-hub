
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileImage, FileText, Link, Package } from 'lucide-react';
import { Ocorrencia } from '@/types/ocorrencias.types';
import { getPrioridadeBadge, getStatusBadge, getDocumentTypeText } from '@/utils/ocorrenciasUtils';

interface OcorrenciaDetailDialogProps {
  ocorrencia: Ocorrencia;
  onClose: () => void;
  onLinkDocument: (ocorrencia: Ocorrencia) => void;
}

const OcorrenciaDetailDialog: React.FC<OcorrenciaDetailDialogProps> = ({ 
  ocorrencia, 
  onClose,
  onLinkDocument
}) => {
  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Detalhes da Ocorrência #{ocorrencia.id}</DialogTitle>
        <DialogDescription>
          Visualize todos os detalhes e atualize o status da ocorrência.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">{ocorrencia.cliente}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="mt-1">{getStatusBadge(ocorrencia.status)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nota Fiscal</p>
            <p className="font-medium">{ocorrencia.nf}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo</p>
            <p className="font-medium">
              {ocorrencia.tipo === 'extravio' ? 'Extravio' : 
               ocorrencia.tipo === 'avaria' ? 'Avaria' :
               ocorrencia.tipo === 'atraso' ? 'Atraso' :
               ocorrencia.tipo === 'divergencia' ? 'Divergência' : 
               ocorrencia.tipo}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Prioridade</p>
            <div className="mt-1">{getPrioridadeBadge(ocorrencia.prioridade)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Data do Registro</p>
            <p className="font-medium">{ocorrencia.dataRegistro}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Data da Ocorrência</p>
            <p className="font-medium">{ocorrencia.dataOcorrencia}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Valor do Prejuízo</p>
            <p className={`font-medium ${parseFloat(ocorrencia.valorPrejuizo?.replace(',', '.') || '0') > 0 ? 'text-red-500' : ''}`}>
              {parseFloat(ocorrencia.valorPrejuizo?.replace(',', '.') || '0') > 0 ? 
                `R$ ${ocorrencia.valorPrejuizo}` : 
                'R$ 0,00'}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Documento Vinculado</p>
          <div className="mt-1 flex items-center">
            {ocorrencia.documentoVinculado ? (
              <>
                {ocorrencia.tipoDocumento === 'nota' ? (
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                ) : ocorrencia.tipoDocumento === 'coleta' ? (
                  <Package className="mr-2 h-5 w-5 text-green-600" />
                ) : (
                  <FileText className="mr-2 h-5 w-5 text-purple-600" />
                )}
                <div>
                  <p className="font-medium">{ocorrencia.documentoVinculado}</p>
                  <p className="text-xs text-gray-500">{getDocumentTypeText(ocorrencia.tipoDocumento || '')}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Nenhum documento vinculado</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => onLinkDocument(ocorrencia)}
                >
                  <Link className="h-4 w-4" />
                  Vincular agora
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Descrição</p>
          <p className="mt-1 p-3 bg-gray-50 rounded-md">{ocorrencia.descricao}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Evidências</p>
          <div className="flex space-x-2">
            <div className="p-4 border border-dashed rounded-lg w-24 h-24 flex items-center justify-center">
              <FileImage className="text-gray-400" size={32} />
            </div>
            <div className="p-4 border border-dashed rounded-lg w-24 h-24 flex items-center justify-center">
              <FileText className="text-gray-400" size={32} />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-2">Atualizar Status</p>
          <div className="flex space-x-4 items-center">
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione um novo status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-cross-blue hover:bg-cross-blueDark">Atualizar</Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Adicionar Comentário</p>
          <Textarea placeholder="Digite um comentário ou observação" />
          <div className="flex justify-end">
            <Button variant="outline" className="mr-2">
              Anexar Arquivo
            </Button>
            <Button className="bg-cross-gray hover:bg-cross-grayDark">
              Adicionar
            </Button>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          variant="outline"
          className="mr-auto"
          onClick={onClose}
        >
          Fechar
        </Button>
        
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" /> Gerar Relatório
        </Button>
        
        {ocorrencia.status !== 'closed' && (
          <Button className="bg-cross-blue hover:bg-cross-blueDark">
            Salvar Alterações
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default OcorrenciaDetailDialog;
