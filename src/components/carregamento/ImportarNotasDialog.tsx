
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { NotaFiscal } from "@/hooks/carregamento/useOrdemCarregamento";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

interface ImportarNotasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (notasIds: string[]) => void;
  notasFiscaisDisponiveis: NotaFiscal[];
  isLoading: boolean;
}

const ImportarNotasDialog: React.FC<ImportarNotasDialogProps> = ({
  open,
  onOpenChange,
  onImport,
  notasFiscaisDisponiveis,
  isLoading
}) => {
  const [selectedNotas, setSelectedNotas] = useState<string[]>([]);
  
  useEffect(() => {
    if (open) {
      setSelectedNotas([]);
    }
  }, [open]);
  
  const handleToggleNota = (notaId: string) => {
    setSelectedNotas(prev => 
      prev.includes(notaId)
        ? prev.filter(id => id !== notaId)
        : [...prev, notaId]
    );
  };
  
  const handleImport = () => {
    if (selectedNotas.length === 0) {
      toast({
        title: "Nenhuma nota fiscal selecionada",
        description: "Selecione pelo menos uma nota fiscal para importar.",
        variant: "destructive",
      });
      return;
    }
    
    onImport(selectedNotas);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Importar Notas Fiscais</DialogTitle>
          <DialogDescription>
            Selecione as notas fiscais que deseja importar para esta Ordem de Carregamento.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="animate-spin h-8 w-8 text-cross-blue" />
            <span className="ml-2">Carregando notas fiscais...</span>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notasFiscaisDisponiveis.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma nota fiscal disponível para importação.
              </div>
            ) : (
              <div className="space-y-2">
                {notasFiscaisDisponiveis.map(nota => (
                  <div key={nota.id} className="flex items-center space-x-3 border rounded-md p-3">
                    <Checkbox 
                      id={`nota-${nota.id}`} 
                      checked={selectedNotas.includes(nota.id)}
                      onCheckedChange={() => handleToggleNota(nota.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">NF {nota.numero}</div>
                      <div className="text-sm text-gray-500">
                        Cliente: {nota.cliente} • Valor: R$ {nota.valor.toFixed(2)} • Data: {nota.dataEmissao}
                      </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleImport} 
            disabled={selectedNotas.length === 0 || isLoading}
            className="bg-cross-blue hover:bg-cross-blue/90"
          >
            Importar Selecionadas ({selectedNotas.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportarNotasDialog;
