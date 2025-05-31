
import { z } from 'zod';

export const notaFiscalSchema = z.object({
  // Tab atual
  currentTab: z.string().optional(),
  
  // Dados da Nota Fiscal
  numeroNF: z.string().min(1, 'Número da NF é obrigatório'),
  serieNF: z.string().optional(),
  chaveNF: z.string().optional(),
  dataHoraEmissao: z.string().optional(),
  valorTotal: z.union([z.string(), z.number()]).optional(),
  pesoTotalBruto: z.union([z.string(), z.number()]).optional(),
  volumesTotal: z.union([z.string(), z.number()]).optional(),
  tipoOperacao: z.string().optional(),

  // Dados do Emitente
  emitenteCNPJ: z.string().optional(),
  emitenteRazaoSocial: z.string().optional(),
  emitenteTelefone: z.string().optional(),
  emitenteUF: z.string().optional(),
  emitenteCidade: z.string().optional(),
  emitenteBairro: z.string().optional(),
  emitenteEndereco: z.string().optional(),
  emitenteNumero: z.string().optional(),
  emitenteCEP: z.string().optional(),

  // Dados do Destinatário
  destinatarioCNPJ: z.string().optional(),
  destinatarioRazaoSocial: z.string().optional(),
  destinatarioTelefone: z.string().optional(),
  destinatarioUF: z.string().optional(),
  destinatarioCidade: z.string().optional(),
  destinatarioBairro: z.string().optional(),
  destinatarioEndereco: z.string().optional(),
  destinatarioNumero: z.string().optional(),
  destinatarioCEP: z.string().optional(),

  // Informações Adicionais
  informacoesComplementares: z.string().optional(),
  numeroPedido: z.string().optional(),
  tipoFrete: z.string().optional(), // NOVO CAMPO

  // Informações de Transporte
  numeroColeta: z.string().optional(),
  valorColeta: z.union([z.string(), z.number()]).optional(),
  numeroCTeColeta: z.string().optional(),
  numeroCTeViagem: z.string().optional(),
  dataEmbarque: z.string().optional(),

  // Informações Complementares
  dataHoraEntrada: z.string().optional(),
  statusEmbarque: z.string().optional(),
  responsavelEntrega: z.string().optional(),
  quimico: z.string().optional(),
  fracionado: z.string().optional(),
  motorista: z.string().optional(),
  tempoArmazenamento: z.union([z.string(), z.number()]).optional(),
  entregueAoFornecedor: z.string().optional(),
});

export type NotaFiscalSchemaType = z.infer<typeof notaFiscalSchema>;

export const defaultValues: NotaFiscalSchemaType = {
  currentTab: 'chave',
  numeroNF: '',
  serieNF: '',
  chaveNF: '',
  dataHoraEmissao: '',
  valorTotal: '',
  pesoTotalBruto: '',
  volumesTotal: '',
  tipoOperacao: 'entrada',
  
  // Emitente
  emitenteCNPJ: '',
  emitenteRazaoSocial: '',
  emitenteTelefone: '',
  emitenteUF: '',
  emitenteCidade: '',
  emitenteBairro: '',
  emitenteEndereco: '',
  emitenteNumero: '',
  emitenteCEP: '',
  
  // Destinatário
  destinatarioCNPJ: '',
  destinatarioRazaoSocial: '',
  destinatarioTelefone: '',
  destinatarioUF: '',
  destinatarioCidade: '',
  destinatarioBairro: '',
  destinatarioEndereco: '',
  destinatarioNumero: '',
  destinatarioCEP: '',
  
  // Informações Adicionais
  informacoesComplementares: '',
  numeroPedido: '',
  tipoFrete: '', // NOVO CAMPO
  
  // Transporte
  numeroColeta: '',
  valorColeta: '',
  numeroCTeColeta: '',
  numeroCTeViagem: '',
  dataEmbarque: '',
  
  // Complementares
  dataHoraEntrada: '',
  statusEmbarque: '',
  responsavelEntrega: '',
  quimico: 'nao',
  fracionado: 'nao',
  motorista: '',
  tempoArmazenamento: '',
  entregueAoFornecedor: '',
};
