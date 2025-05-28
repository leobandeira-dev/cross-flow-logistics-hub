
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UseFormSetValue } from 'react-hook-form';
import { NotaFiscalSchemaType } from '../notaFiscalSchema';

interface XMLNotaFiscal {
  numero?: string;
  serie?: string;
  chaveAcesso?: string;
  valorTotal?: string;
  pesoTotalBruto?: string;
  volumesTotal?: string;
  dataHoraEmissao?: string;
  tipoOperacao?: string;
  
  // Emitente
  emitenteCNPJ?: string;
  emitenteRazaoSocial?: string;
  emitenteTelefone?: string;
  emitenteUF?: string;
  emitenteCidade?: string;
  emitenteBairro?: string;
  emitenteEndereco?: string;
  emitenteNumero?: string;
  emitenteCEP?: string;
  
  // Destinatário
  destinatarioCNPJ?: string;
  destinatarioRazaoSocial?: string;
  destinatarioTelefone?: string;
  destinatarioUF?: string;
  destinatarioCidade?: string;
  destinatarioBairro?: string;
  destinatarioEndereco?: string;
  destinatarioNumero?: string;
  destinatarioCEP?: string;
  
  // Informações adicionais
  informacoesComplementares?: string;
  quimico?: boolean;
  fracionado?: boolean;
  
  // Itens
  itens?: Array<{
    codigoProduto: string;
    descricao: string;
    quantidade: string;
    valorUnitario: string;
    valorTotal: string;
  }>;
}

export const useXmlFileHandler = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const parseXMLFile = async (file: File): Promise<XMLNotaFiscal> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const xmlContent = e.target?.result as string;
          console.log('Conteúdo XML recebido:', xmlContent);
          
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
          
          // Verificar se há erros de parsing
          const parseError = xmlDoc.querySelector('parsererror');
          if (parseError) {
            throw new Error('Erro ao analisar o arquivo XML');
          }
          
          // Extrair dados da nota fiscal
          const nfeNode = xmlDoc.querySelector('NFe') || xmlDoc.querySelector('nfe');
          if (!nfeNode) {
            throw new Error('Arquivo XML não contém uma nota fiscal válida');
          }
          
          // Dados básicos da NF
          const ide = nfeNode.querySelector('ide');
          const emit = nfeNode.querySelector('emit');
          const dest = nfeNode.querySelector('dest');
          const total = nfeNode.querySelector('total');
          const transp = nfeNode.querySelector('transp');
          const infAdic = nfeNode.querySelector('infAdic');
          
          // Extrair dados dos produtos
          const detNodes = nfeNode.querySelectorAll('det');
          const itens = Array.from(detNodes).map((det, index) => {
            const prod = det.querySelector('prod');
            return {
              codigoProduto: prod?.querySelector('cProd')?.textContent || `PROD${index + 1}`,
              descricao: prod?.querySelector('xProd')?.textContent || 'Produto',
              quantidade: prod?.querySelector('qCom')?.textContent || '0',
              valorUnitario: prod?.querySelector('vUnCom')?.textContent || '0',
              valorTotal: prod?.querySelector('vProd')?.textContent || '0'
            };
          });
          
          const notaFiscal: XMLNotaFiscal = {
            // Dados básicos
            numero: ide?.querySelector('nNF')?.textContent || '',
            serie: ide?.querySelector('serie')?.textContent || '',
            chaveAcesso: nfeNode.querySelector('infNFe')?.getAttribute('Id')?.replace('NFe', '') || '',
            valorTotal: total?.querySelector('ICMSTot vNF')?.textContent || 
                        total?.querySelector('vNF')?.textContent || '0',
            dataHoraEmissao: ide?.querySelector('dhEmi')?.textContent || 
                           ide?.querySelector('dEmi')?.textContent || '',
            tipoOperacao: ide?.querySelector('natOp')?.textContent || '',
            
            // Peso e volumes (se disponível no transporte)
            pesoTotalBruto: transp?.querySelector('vol pesoB')?.textContent || 
                           transp?.querySelector('pesoB')?.textContent || '',
            volumesTotal: transp?.querySelector('vol qVol')?.textContent || 
                         transp?.querySelector('qVol')?.textContent || '',
            
            // Dados do emitente
            emitenteCNPJ: emit?.querySelector('CNPJ')?.textContent || '',
            emitenteRazaoSocial: emit?.querySelector('xNome')?.textContent || '',
            emitenteTelefone: emit?.querySelector('enderEmit fone')?.textContent || 
                             emit?.querySelector('fone')?.textContent || '',
            emitenteUF: emit?.querySelector('enderEmit UF')?.textContent || 
                       emit?.querySelector('UF')?.textContent || '',
            emitenteCidade: emit?.querySelector('enderEmit xMun')?.textContent || 
                           emit?.querySelector('xMun')?.textContent || '',
            emitenteBairro: emit?.querySelector('enderEmit xBairro')?.textContent || 
                           emit?.querySelector('xBairro')?.textContent || '',
            emitenteEndereco: emit?.querySelector('enderEmit xLgr')?.textContent || 
                             emit?.querySelector('xLgr')?.textContent || '',
            emitenteNumero: emit?.querySelector('enderEmit nro')?.textContent || 
                           emit?.querySelector('nro')?.textContent || '',
            emitenteCEP: emit?.querySelector('enderEmit CEP')?.textContent || 
                        emit?.querySelector('CEP')?.textContent || '',
            
            // Dados do destinatário
            destinatarioCNPJ: dest?.querySelector('CNPJ')?.textContent || '',
            destinatarioRazaoSocial: dest?.querySelector('xNome')?.textContent || '',
            destinatarioTelefone: dest?.querySelector('enderDest fone')?.textContent || 
                                 dest?.querySelector('fone')?.textContent || '',
            destinatarioUF: dest?.querySelector('enderDest UF')?.textContent || 
                           dest?.querySelector('UF')?.textContent || '',
            destinatarioCidade: dest?.querySelector('enderDest xMun')?.textContent || 
                               dest?.querySelector('xMun')?.textContent || '',
            destinatarioBairro: dest?.querySelector('enderDest xBairro')?.textContent || 
                               dest?.querySelector('xBairro')?.textContent || '',
            destinatarioEndereco: dest?.querySelector('enderDest xLgr')?.textContent || 
                                 dest?.querySelector('xLgr')?.textContent || '',
            destinatarioNumero: dest?.querySelector('enderDest nro')?.textContent || 
                               dest?.querySelector('nro')?.textContent || '',
            destinatarioCEP: dest?.querySelector('enderDest CEP')?.textContent || 
                            dest?.querySelector('CEP')?.textContent || '',
            
            // Informações adicionais
            informacoesComplementares: infAdic?.querySelector('infCpl')?.textContent || '',
            
            // Verificar se é produto químico (baseado na descrição dos produtos)
            quimico: itens.some(item => 
              item.descricao.toLowerCase().includes('quimico') ||
              item.descricao.toLowerCase().includes('químico') ||
              item.descricao.toLowerCase().includes('perigoso')
            ),
            
            // Verificar se é fracionado (baseado na quantidade de itens)
            fracionado: itens.length > 1,
            
            // Itens da nota fiscal
            itens
          };
          
          console.log('Dados extraídos do XML:', notaFiscal);
          resolve(notaFiscal);
        } catch (error) {
          console.error('Erro ao processar XML:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erro ao ler o arquivo'));
      };
      
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setValue: UseFormSetValue<NotaFiscalSchemaType>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xml')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo XML válido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const xmlData = await parseXMLFile(file);
      
      // Preencher todos os campos do formulário com os dados do XML
      setValue('numeroNF', xmlData.numero || '');
      setValue('serieNF', xmlData.serie || '');
      setValue('chaveNF', xmlData.chaveAcesso || '');
      setValue('valorTotal', xmlData.valorTotal || '');
      setValue('pesoTotalBruto', xmlData.pesoTotalBruto || '');
      setValue('volumesTotal', xmlData.volumesTotal || '');
      setValue('dataHoraEmissao', xmlData.dataHoraEmissao || '');
      setValue('tipoOperacao', xmlData.tipoOperacao || '');
      
      // Dados do emitente
      setValue('emitenteCNPJ', xmlData.emitenteCNPJ || '');
      setValue('emitenteRazaoSocial', xmlData.emitenteRazaoSocial || '');
      setValue('emitenteTelefone', xmlData.emitenteTelefone || '');
      setValue('emitenteUF', xmlData.emitenteUF || '');
      setValue('emitenteCidade', xmlData.emitenteCidade || '');
      setValue('emitenteBairro', xmlData.emitenteBairro || '');
      setValue('emitenteEndereco', xmlData.emitenteEndereco || '');
      setValue('emitenteNumero', xmlData.emitenteNumero || '');
      setValue('emitenteCEP', xmlData.emitenteCEP || '');
      
      // Dados do destinatário
      setValue('destinatarioCNPJ', xmlData.destinatarioCNPJ || '');
      setValue('destinatarioRazaoSocial', xmlData.destinatarioRazaoSocial || '');
      setValue('destinatarioTelefone', xmlData.destinatarioTelefone || '');
      setValue('destinatarioUF', xmlData.destinatarioUF || '');
      setValue('destinatarioCidade', xmlData.destinatarioCidade || '');
      setValue('destinatarioBairro', xmlData.destinatarioBairro || '');
      setValue('destinatarioEndereco', xmlData.destinatarioEndereco || '');
      setValue('destinatarioNumero', xmlData.destinatarioNumero || '');
      setValue('destinatarioCEP', xmlData.destinatarioCEP || '');
      
      // Informações adicionais
      setValue('informacoesComplementares', xmlData.informacoesComplementares || '');
      setValue('quimico', xmlData.quimico ? 'sim' : 'nao');
      setValue('fracionado', xmlData.fracionado ? 'sim' : 'nao');
      
      // Itens da nota fiscal
      if (xmlData.itens && xmlData.itens.length > 0) {
        setValue('itens', xmlData.itens);
      }
      
      toast({
        title: "XML importado com sucesso",
        description: `Dados da nota fiscal ${xmlData.numero} foram carregados.`,
      });
      
    } catch (error) {
      console.error('Erro ao processar arquivo XML:', error);
      toast({
        title: "Erro ao processar XML",
        description: "Não foi possível extrair os dados do arquivo XML. Verifique se o arquivo está válido.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleFileUpload, isLoading };
};
