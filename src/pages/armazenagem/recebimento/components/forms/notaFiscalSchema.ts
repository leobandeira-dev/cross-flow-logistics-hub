
import * as z from "zod"

// Define a schema for Nota Fiscal
export const notaFiscalSchema = z.object({
  chaveNF: z.string().optional(),
  numeroNF: z.string().optional(),
  serieNF: z.string().optional(),
  dataHoraEmissao: z.string().optional(),
  tipoOperacao: z.string().optional(),
  
  emitenteCNPJ: z.string().optional(),
  emitenteRazaoSocial: z.string().optional(),
  emitenteTelefone: z.string().optional(),
  emitenteUF: z.string().optional(),
  emitenteCidade: z.string().optional(),
  emitenteBairro: z.string().optional(),
  emitenteEndereco: z.string().optional(),
  emitenteNumero: z.string().optional(),
  emitenteCEP: z.string().optional(),
  
  destinatarioCNPJ: z.string().optional(),
  destinatarioRazaoSocial: z.string().optional(),
  destinatarioTelefone: z.string().optional(),
  destinatarioUF: z.string().optional(),
  destinatarioCidade: z.string().optional(),
  destinatarioBairro: z.string().optional(),
  destinatarioEndereco: z.string().optional(),
  destinatarioNumero: z.string().optional(),
  destinatarioCEP: z.string().optional(),
  
  pesoTotalBruto: z.string().optional(),
  volumesQuantidade: z.string().optional(),
  volumesTotal: z.string().optional(), // Added to support component usage
  valorTotal: z.string().optional(),
  formaPagamento: z.string().optional(),
  
  transportadoraNome: z.string().optional(),
  transportadoraCNPJ: z.string().optional(),
  placaVeiculo: z.string().optional(),
  ufVeiculo: z.string().optional(),
  antt: z.string().optional(),
  
  entregueAoFornecedor: z.string().optional(),
  observacoes: z.string().optional(),
  localArmazenagem: z.string().optional(),
  tempoArmazenamento: z.string().optional(),
  
  // Additional fields to support form components
  fobCif: z.string().optional(),
  numeroPedido: z.string().optional(),
  informacoesComplementares: z.string().optional(),
  dataHoraEntrada: z.string().optional(),
  statusEmbarque: z.string().optional(),
  responsavelEntrega: z.string().optional(),
  quimico: z.string().optional(),
  fracionado: z.string().optional(),
  motorista: z.string().optional(),
  numeroColeta: z.string().optional(),
  valorColeta: z.string().optional(),
  numeroCTeColeta: z.string().optional(),
  numeroCTeViagem: z.string().optional(),
  dataEmbarque: z.string().optional(),
});

export type NotaFiscalSchemaType = z.infer<typeof notaFiscalSchema>;

// Default values for the form
export const defaultValues: NotaFiscalSchemaType = {
  chaveNF: '',
  numeroNF: '',
  serieNF: '',
  dataHoraEmissao: '',
  tipoOperacao: '',
  
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
  
  pesoTotalBruto: '',
  volumesQuantidade: '',
  volumesTotal: '',
  valorTotal: '',
  formaPagamento: '',
  
  transportadoraNome: '',
  transportadoraCNPJ: '',
  placaVeiculo: '',
  ufVeiculo: '',
  antt: '',
  
  entregueAoFornecedor: 'nao',
  observacoes: '',
  localArmazenagem: '',
  tempoArmazenamento: '',
  
  // Initialize additional fields
  fobCif: '',
  numeroPedido: '',
  informacoesComplementares: '',
  dataHoraEntrada: '',
  statusEmbarque: '',
  responsavelEntrega: '',
  quimico: 'nao',
  fracionado: 'nao',
  motorista: '',
  numeroColeta: '',
  valorColeta: '',
  numeroCTeColeta: '',
  numeroCTeViagem: '',
  dataEmbarque: '',
};
