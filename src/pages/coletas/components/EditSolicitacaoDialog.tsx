
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SolicitacaoColeta } from '../types/coleta.types';

interface EditSolicitacaoDialogProps {
  solicitacao: SolicitacaoColeta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (solicitacao: SolicitacaoColeta) => void;
}

const EditSolicitacaoDialog: React.FC<EditSolicitacaoDialogProps> = ({ 
  solicitacao, 
  open, 
  onOpenChange,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SolicitacaoColeta | null>(solicitacao);

  // Atualiza o formData quando a solicitação muda
  React.useEffect(() => {
    setFormData(solicitacao);
  }, [solicitacao]);

  if (!formData) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleNotasChange = (notasString: string) => {
    const notasArray = notasString.split(',').map(nota => nota.trim());
    setFormData(prev => {
      if (!prev) return prev;
      return { ...prev, notas: notasArray };
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      toast({
        title: "Solicitação atualizada",
        description: `A solicitação ${formData.id} foi atualizada com sucesso.`
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Editar Solicitação de Coleta - {formData.id}</DialogTitle>
          <DialogDescription>
            Edite os dados da solicitação de coleta.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input 
                id="cliente" 
                value={formData.cliente || ''} 
                onChange={(e) => handleChange('cliente', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input 
                id="data" 
                value={formData.data || ''} 
                onChange={(e) => handleChange('data', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origem">Origem</Label>
              <Input 
                id="origem" 
                value={formData.origem || ''} 
                onChange={(e) => handleChange('origem', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <Input 
                id="destino" 
                value={formData.destino || ''} 
                onChange={(e) => handleChange('destino', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volumes">Volumes</Label>
              <Input 
                id="volumes" 
                type="number" 
                value={formData.volumes || 0} 
                onChange={(e) => handleChange('volumes', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso">Peso</Label>
              <Input 
                id="peso" 
                value={formData.peso || ''} 
                onChange={(e) => handleChange('peso', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecionar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Recusado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notas">Notas Fiscais (separadas por vírgula)</Label>
            <Input 
              id="notas" 
              value={formData.notas?.join(', ') || ''} 
              onChange={(e) => handleNotasChange(e.target.value)}
            />
          </div>

          {formData.observacoes !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                value={formData.observacoes || ''} 
                onChange={(e) => handleChange('observacoes', e.target.value)}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-cross-blue hover:bg-cross-blueDark">Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSolicitacaoDialog;
