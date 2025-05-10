
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { SolicitacaoColeta } from '../types/coleta.types';
import { toast } from "@/hooks/use-toast";

// Schema para validação do formulário de aprovação/rejeição
const formSchema = z.object({
  observacoes: z.string().optional(),
  motivoRecusa: z.string().min(10, {
    message: "O motivo da recusa deve ter pelo menos 10 caracteres",
  }).optional().refine(value => {
    // Se estamos no modo de rejeição, o motivo é obrigatório
    if ((window as any).isRejecting && (!value || value.length < 10)) {
      return false;
    }
    return true;
  }, {
    message: "O motivo da recusa é obrigatório para rejeições",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AprovacaoFormProps {
  selectedRequest: SolicitacaoColeta;
  isRejecting: boolean;
  setIsRejecting: (value: boolean) => void;
  onClose: () => void;
  onApprove: (observacoes?: string) => void;
  onReject: (motivoRecusa: string) => void;
}

const AprovacaoForm: React.FC<AprovacaoFormProps> = ({
  selectedRequest,
  isRejecting,
  setIsRejecting,
  onClose,
  onApprove,
  onReject
}) => {
  // Inicializando o formulário com react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observacoes: '',
      motivoRecusa: '',
    },
  });

  // Definição global para que o refine do schema funcione
  (window as any).isRejecting = isRejecting;
  
  const handleApprove = (data: FormData) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}`;
    const approverName = "Maria Oliveira"; // Normalmente viria da sessão do usuário
    
    // Call the parent onApprove function
    onApprove(data.observacoes);
    
    toast({
      title: "Coleta aprovada com sucesso!",
      description: `A coleta ${selectedRequest.id} foi aprovada em ${formattedDate} por ${approverName}.`,
    });
    
    form.reset();
  };
  
  const handleReject = (data: FormData) => {
    if (!data.motivoRecusa || data.motivoRecusa.length < 10) {
      form.setError('motivoRecusa', {
        type: 'manual',
        message: 'O motivo da recusa é obrigatório e deve ter pelo menos 10 caracteres',
      });
      return;
    }
    
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}`;
    const approverName = "Maria Oliveira"; // Normalmente viria da sessão do usuário
    
    // Call the parent onReject function
    onReject(data.motivoRecusa);
    
    toast({
      title: "Coleta recusada",
      description: `A coleta ${selectedRequest.id} foi recusada em ${formattedDate} por ${approverName}.`,
      variant: "destructive",
    });
    
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(isRejecting ? handleReject : handleApprove)} className="space-y-4">
        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Adicione observações sobre esta aprovação" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isRejecting && (
          <FormField
            control={form.control}
            name="motivoRecusa"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-destructive font-bold">Motivo da Recusa (obrigatório)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informe o motivo detalhado da recusa" 
                    {...field}
                    className="border-destructive focus:border-destructive"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" type="button" onClick={onClose}>Fechar</Button>
          {!isRejecting && (
            <Button 
              variant="destructive" 
              type="button" 
              onClick={() => {
                setIsRejecting(true);
                (window as any).isRejecting = true;
              }}
            >
              <XCircle className="mr-2 h-4 w-4" /> Recusar
            </Button>
          )}
          <Button 
            type="submit" 
            className={isRejecting ? "bg-destructive hover:bg-destructive/90" : "bg-cross-success hover:bg-green-700"}
          >
            {isRejecting ? (
              <>
                <XCircle className="mr-2 h-4 w-4" /> Confirmar Recusa
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Aprovar
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AprovacaoForm;
