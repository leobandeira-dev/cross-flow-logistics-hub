
import { z } from 'zod';

export const notaFiscalSchema = z.object({
  // Tab atual
  currentTab: z.string().optional(),
  
  // Dados da Nota Fiscal
  numeroNF: z.string().min(1, 'Número da NF é obrigatório'),
  serieNF: z.string().optional(),
  chaveNF: z.string().optional(),
  dataEmissao: z.string().optional(),
  valorTotal: z.union([z.string(), z.number()]).optional(),
  pesoBruto: z.union([z.string(), z.number()]).optional(),
  quantidadeVolumes: z.union([z.string(), z.number()]).optional(),
  tipoOperacao: z.string().optional(),

  // Dados do Emitente
  emitenteCnpj: z.string().optional(),
  emitenteRazaoSocial: z.string().optional(),
  emitenteTelefone: z.string().optional(),
  emitenteUf: z.string().optional(),
  emitenteCidade: z.string().optional(),
  emitenteBairro: z.string().optional(),
  emitenteEndereco: z.string().optional(),
  emitenteNumero: z.string().optional(),
  emitenteCep: z.string().optional(),

  // Dados do Destinatário
  destinatarioCnpj: z.string().optional(),
  destinatarioRazaoSocial: z.string().optional(),
  destinatarioTelefone: z.string().optional(),
  destinatarioUf: z.string().optional(),
  destinatarioCidade: z.string().optional(),
  destinatarioBairro: z.string().optional(),
  destinatarioEndereco: z.string().optional(),
  destinatarioNumero: z.string().optional(),
  destinatarioCep: z.string().optional(),

  // Informações Adicionais
  informacoesComplementares: z.string().optional(),
  numeroPedido: z.string().optional(),
  fobCif: z.string().optional(),

  // Informações de Transporte
  numeroColeta: z.string().optional(),
  valorColeta: z.union([z.string(), z.number()]).optional(),
  numeroCteColeta: z.string().optional(),
  numeroCteViagem: z.string().optional(),
  statusEmbarque: z.string().optional(),

  // Informações Complementares
  responsavelEntrega: z.string().optional(),
  quimico: z.boolean().optional(),
  fracionado: z.boolean().optional(),
  motorista: z.string().optional(),
  tempoArmazenamento: z.union([z.string(), z.number()]).optional(),
  entregueAoFornecedor: z.string().optional(),
  observacoes: z.string().optional(),
});

export type NotaFiscalSchemaType = z.infer<typeof notaFiscalSchema>;

export const defaultValues: NotaFiscalSchemaType = {
  currentTab: 'chave',
  numeroNF: '',
  serieNF: '',
  chaveNF: '',
  dataEmissao: '',
  valorTotal: '',
  pesoBruto: '',
  quantidadeVolumes: '',
  tipoOperacao: 'entrada',
  
  // Emitente
  emitenteCnpj: '',
  emitenteRazaoSocial: '',
  emitenteTelefone: '',
  emitenteUf: '',
  emitenteCidade: '',
  emitenteBairro: '',
  emitenteEndereco: '',
  emitenteNumero: '',
  emitenteCep: '',
  
  // Destinatário
  destinatarioCnpj: '',
  destinatarioRazaoSocial: '',
  destinatarioTelefone: '',
  destinatarioUf: '',
  destinatarioCidade: '',
  destinatarioBairro: '',
  destinatarioEndereco: '',
  destinatarioNumero: '',
  destinatarioCep: '',
  
  // Informações Adicionais
  informacoesComplementares: '',
  numeroPedido: '',
  fobCif: '',
  
  // Transporte
  numeroColeta: '',
  valorColeta: '',
  numeroCteColeta: '',
  numeroCteViagem: '',
  statusEmbarque: '',
  
  // Complementares
  responsavelEntrega: '',
  quimico: false,
  fracionado: false,
  motorista: '',
  tempoArmazenamento: '',
  entregueAoFornecedor: '',
  observacoes: '',
};
