
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useNotaFiscalImport } from '@/hooks/notaFiscal/useNotaFiscalImport';
import XMLFileUpload from './XMLFileUpload';

interface ImportarViaXMLWithSaveProps {
  onNotasImported?: (notas: any[]) => void;
  onFormPopulated?: (notaData: any) => void;
}

const ImportarViaXMLWithSave: React.FC<ImportarViaXMLWithSaveProps> = ({ 
  onNotasImported, 
  onFormPopulated 
}) => {
  const { isImporting, importSingleXML } = useNotaFiscalImport();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedNota = await importSingleXML(file);
      
      // Notify parent about imported notas
      if (onNotasImported) {
        onNotasImported([importedNota]);
      }
      
      // Populate form with all extracted data
      if (onFormPopulated && importedNota) {
        const formData = {
          // Basic nota fiscal data
          numeroNF: importedNota.numeroNF || importedNota.numero || '',
          serieNF: importedNota.serieNF || importedNota.serie || '',
          chaveNF: importedNota.chaveNF || importedNota.chave_acesso || '',
          valorTotal: importedNota.valorTotal?.toString() || importedNota.valor_total?.toString() || '',
          pesoTotalBruto: importedNota.pesoTotalBruto?.toString() || importedNota.peso_bruto?.toString() || '',
          volumesTotal: importedNota.volumesTotal?.toString() || importedNota.quantidade_volumes?.toString() || '',
          dataHoraEmissao: importedNota.dataEmissao || importedNota.data_emissao || '',
          
          // Emitente data
          emitenteCNPJ: importedNota.emitenteCNPJ || importedNota.emitente_cnpj || '',
          emitenteRazaoSocial: importedNota.emitenteRazaoSocial || importedNota.emitente_razao_social || '',
          emitenteTelefone: importedNota.emitente_telefone || importedNota.emitenteTelefone || '',
          emitenteUF: importedNota.emitenteUF || importedNota.emitente_uf || '',
          emitenteCidade: importedNota.emitenteCidade || importedNota.emitente_cidade || '',
          emitenteBairro: importedNota.emitenteBairro || importedNota.emitente_bairro || '',
          emitenteEndereco: importedNota.emitenteEndereco || importedNota.emitente_endereco || '',
          emitenteNumero: importedNota.emitenteNumero || importedNota.emitente_numero || '',
          emitenteCEP: importedNota.emitenteCEP || importedNota.emitente_cep || '',
          
          // Destinatario data
          destinatarioCNPJ: importedNota.destinatarioCNPJ || importedNota.destinatario_cnpj || '',
          destinatarioRazaoSocial: importedNota.destinatarioRazaoSocial || importedNota.destinatario_razao_social || '',
          destinatarioTelefone: importedNota.destinatario_telefone || importedNota.destinatarioTelefone || '',
          destinatarioUF: importedNota.destinatarioUF || importedNota.destinatario_uf || '',
          destinatarioCidade: importedNota.destinatarioCidade || importedNota.destinatario_cidade || '',
          destinatarioBairro: importedNota.destinatarioBairro || importedNota.destinatario_bairro || '',
          destinatarioEndereco: importedNota.destinatarioEndereco || importedNota.destinatario_endereco || '',
          destinatarioNumero: importedNota.destinatarioNumero || importedNota.destinatario_numero || '',
          destinatarioCEP: importedNota.destinatarioCEP || importedNota.destinatario_cep || '',
          
          // Additional data
          numeroPedido: importedNota.numeroPedido || importedNota.numero_pedido || '',
          informacoesComplementares: importedNota.informacoesComplementares || importedNota.informacoes_complementares || importedNota.observacoes || '',
          tipoOperacao: importedNota.tipoOperacao || importedNota.tipo_operacao || ''
        };
        
        onFormPopulated(formData);
      }
    } catch (error) {
      console.error('Erro ao importar XML:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Upload className="mr-2 text-cross-blue" size={20} />
          Importar XML Único
        </CardTitle>
      </CardHeader>
      <CardContent>
        <XMLFileUpload 
          onFileChange={handleFileUpload}
          isLoading={isImporting}
        />
      </CardContent>
    </Card>
  );
};

export default ImportarViaXMLWithSave;
