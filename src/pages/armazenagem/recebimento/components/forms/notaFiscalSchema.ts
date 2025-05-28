
import { z } from "zod";

// Define the schema using zod
export const notaFiscalSchema = z.object({
  // Current tab
  currentTab: z.enum(['chave', 'xml', 'lote', 'manual']).default('chave'),
  
  // Nota Fiscal dados
  chaveNF: z.string().optional(),
  numeroNF: z.string().optional(),
  serieNF: z.string().optional(),
  dataHoraEmissao: z.string().optional(),
  tipoOperacao: z.string().optional(),
  entregueAoFornecedor: z.string().optional(),
  
  // Emitente
  emitenteCNPJ: z.string().optional(),
  emitenteRazaoSocial: z.string().optional(),
  emitenteTelefone: z.string().optional(),
  emitenteUF: z.string().optional(),
  emitenteCidade: z.string().optional(),
  emitenteBairro: z.string().optional(),
  emitenteEndereco: z.string().optional(),
  emitenteNumero: z.string().optional(),
  emitenteCEP: z.string().optional(),
  
  // Destinatário
  destinatarioCNPJ: z.string().optional(),
  destinatarioRazaoSocial: z.string().optional(),
  destinatarioTelefone: z.string().optional(),
  destinatarioUF: z.string().optional(),
  destinatarioCidade: z.string().optional(),
  destinatarioBairro: z.string().optional(),
  destinatarioEndereco: z.string().optional(),
  destinatarioNumero: z.string().optional(),
  destinatarioCEP: z.string().optional(),
  
  // Valores
  valorTotal: z.string().optional(),
  pesoTotalBruto: z.string().optional(),
  
  // Informações adicionais
  informacoesComplementares: z.string().optional(),
  numeroPedido: z.string().optional(),
  volumesTotal: z.string().optional(),
  fobCif: z.string().optional(),
  
  // Informações transporte
  numeroColeta: z.string().optional(),
  valorColeta: z.string().optional(),
  numeroCTeColeta: z.string().optional(),
  numeroCTeViagem: z.string().optional(),
  dataEmbarque: z.string().optional(),
  
  // Informações complementares
  dataHoraEntrada: z.string().optional(),
  statusEmbarque: z.string().optional(),
  responsavelEntrega: z.string().optional(),
  quimico: z.string().optional(),  // Changed from boolean to string to match the Select component usage
  fracionado: z.string().optional(),  // Changed from boolean to string to match the Select component usage
  motorista: z.string().optional(),
  tempoArmazenamento: z.string().optional(),
});

// Create a type from the schema
export type NotaFiscalSchemaType = z.infer<typeof notaFiscalSchema>;

// Define default values
export const defaultValues: NotaFiscalSchemaType = {
  currentTab: 'chave',
  chaveNF: '',
  numeroNF: '',
  serieNF: '',
  dataHoraEmissao: '',
  tipoOperacao: '',
  entregueAoFornecedor: '',
  emitenteCNPJ: '',
  emitenteRazaoSocial: '',
  emitenteTelefone: '',
  emitenteUF: '',
  emitenteCidade: '',
  emitenteBairro: '',
  emitenteEndereco: '',
  emitenteNumero: '',
  emitenteCEP: '',
  destinatarioCNPJ: '',
  destinatarioRazaoSocial: '',
  destinatarioTelefone: '',
  destinatarioUF: '',
  destinatarioCidade: '',
  destinatarioBairro: '',
  destinatarioEndereco: '',
  destinatarioNumero: '',
  destinatarioCEP: '',
  valorTotal: '',
  pesoTotalBruto: '',
  informacoesComplementares: '',
  numeroPedido: '',
  volumesTotal: '',
  fobCif: '',
  numeroColeta: '',
  valorColeta: '',
  numeroCTeColeta: '',
  numeroCTeViagem: '',
  dataEmbarque: '',
  dataHoraEntrada: '',
  statusEmbarque: '',
  responsavelEntrega: '',
  quimico: '',  // Changed default from false to empty string
  fracionado: '', // Changed default from false to empty string
  motorista: '',
  tempoArmazenamento: '',
};
