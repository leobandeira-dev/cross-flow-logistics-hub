
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notaFiscalSchema, NotaFiscalSchemaType } from './notaFiscalSchema';
import DadosNotaFiscal from './DadosNotaFiscal';
import DadosEmitente from './DadosEmitente';
import DadosDestinatario from './DadosDestinatario';
import InformacoesTransporte from './InformacoesTransporte';
import InformacoesComplementares from './InformacoesComplementares';
import { Loader2 } from 'lucide-react';

interface CadastroManualProps {
  onSubmit: (data: NotaFiscalSchemaType) => void;
  isLoading?: boolean;
}

const CadastroManual: React.FC<CadastroManualProps> = ({ onSubmit, isLoading = false }) => {
  const form = useForm<NotaFiscalSchemaType>({
    resolver: zodResolver(notaFiscalSchema),
    defaultValues: {
      currentTab: 'manual',
      numeroNF: '',
      serieNF: '',
      chaveNF: '',
      valorTotal: '0',
      pesoTotalBruto: '0',
      volumesTotal: '0',
      emitenteRazaoSocial: '',
      emitenteCNPJ: '',
      destinatarioRazaoSocial: '',
      destinatarioCNPJ: '',
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro Manual de Nota Fiscal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DadosNotaFiscal />
            <DadosEmitente />
            <DadosDestinatario />
            <InformacoesTransporte />
            <InformacoesComplementares />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-cross-blue hover:bg-cross-blue/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Nota Fiscal'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CadastroManual;
