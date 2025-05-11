
import { Ocorrencia, DocumentosMock } from "../types/ocorrencias.types";

// Mock data for occurrences
export const ocorrencias: Ocorrencia[] = [
  { 
    id: 'OC-2023-001', 
    cliente: 'Indústria ABC Ltda', 
    tipo: 'extravio', 
    dataRegistro: '10/05/2023', 
    dataOcorrencia: '08/05/2023',
    nf: '12345',
    descricao: 'Volume não localizado após entrega.',
    status: 'open',
    prioridade: 'high',
    documentoVinculado: 'NF-12345',
    tipoDocumento: 'nota',
    valorPrejuizo: '1500,00'
  },
  { 
    id: 'OC-2023-002', 
    cliente: 'Distribuidora XYZ', 
    tipo: 'atraso', 
    dataRegistro: '09/05/2023', 
    dataOcorrencia: '08/05/2023',
    nf: '98765',
    descricao: 'Entrega realizada com 2 dias de atraso.',
    status: 'in_progress',
    prioridade: 'medium',
    documentoVinculado: 'COL-456',
    tipoDocumento: 'coleta',
    valorPrejuizo: '0,00'
  },
  { 
    id: 'OC-2023-003', 
    cliente: 'Farmacêutica Beta', 
    tipo: 'avaria', 
    dataRegistro: '08/05/2023', 
    dataOcorrencia: '07/05/2023',
    nf: '54321',
    descricao: 'Caixa danificada. Produto interno intacto.',
    status: 'resolved',
    prioridade: 'low'
  },
  { 
    id: 'OC-2023-004', 
    cliente: 'Eletrônicos Tech', 
    tipo: 'divergencia', 
    dataRegistro: '07/05/2023', 
    dataOcorrencia: '06/05/2023',
    nf: '23456',
    descricao: 'Quantidade recebida divergente da NF.',
    status: 'closed',
    prioridade: 'high'
  },
];

// Mock data for documents that can be linked to occurrences
export const documentosMock: DocumentosMock = {
  notas: [
    { id: 'NF-12345', numero: '12345', cliente: 'Indústria ABC Ltda', data: '08/05/2023', valor: '15000,00' },
    { id: 'NF-23456', numero: '23456', cliente: 'Eletrônicos Tech', data: '06/05/2023', valor: '8750,00' },
    { id: 'NF-34567', numero: '34567', cliente: 'Distribuidora XYZ', data: '05/05/2023', valor: '12300,00' },
  ],
  coletas: [
    { id: 'COL-456', numero: '456', cliente: 'Indústria ABC Ltda', data: '08/05/2023', notasFiscais: ['NF-12345', 'NF-13579'] },
    { id: 'COL-789', numero: '789', cliente: 'Distribuidora XYZ', data: '07/05/2023', notasFiscais: ['NF-98765'] },
  ],
  ordens: [
    { id: 'OC-2023-150', numero: '150/2023', cliente: 'Eletrônicos Tech', data: '05/05/2023', notasFiscais: ['NF-23456'] },
    { id: 'OC-2023-151', numero: '151/2023', cliente: 'Farmacêutica Beta', data: '04/05/2023', notasFiscais: ['NF-54321'] },
  ]
};
