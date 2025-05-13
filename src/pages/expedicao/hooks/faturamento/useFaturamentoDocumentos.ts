
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { DocumentInfo } from '../../components/faturamento/print/schema/documentSchema';

// Tipo estendido para incluir ID e campos adicionais necessários para documentos
interface DocumentoFaturamento extends DocumentInfo {
  id: string;
  status: 'pendente' | 'transito' | 'entregue';
  dataEmissao: Date;
  dataEntrega?: Date;
  totalViagem: number;
}

// Dados simulados para demonstração
const mockDocumentos: DocumentoFaturamento[] = [
  {
    id: '1',
    documentNumber: 'DOC-2025-0001',
    documentType: 'outbound',
    departureDateTime: new Date('2025-05-10T08:00:00'),
    arrivalDateTime: new Date('2025-05-11T14:00:00'),
    driverName: 'José da Silva',
    truckId: 'ABC-1234',
    trailer1: 'XYZ-9876',
    trailer2: '',
    trailerType: 'Sider',
    issuerUser: 'Maria Santos',
    checkerUser: '',
    transporterName: 'Transportes Rápidos Ltda',
    transporterLogo: '',
    status: 'pendente',
    dataEmissao: new Date('2025-05-09T15:30:00'),
    totalViagem: 5432.89
  },
  {
    id: '2',
    documentNumber: 'DOC-2025-0002',
    documentType: 'inbound',
    departureDateTime: new Date('2025-05-08T10:00:00'),
    arrivalDateTime: new Date('2025-05-09T16:00:00'),
    driverName: 'Carlos Oliveira',
    truckId: 'DEF-5678',
    trailer1: 'GHI-4321',
    trailer2: '',
    trailerType: 'Baú',
    issuerUser: 'João Pereira',
    checkerUser: 'Ana Sousa',
    transporterName: 'Logística Nacional S.A.',
    transporterLogo: '',
    status: 'transito',
    dataEmissao: new Date('2025-05-07T16:45:00'),
    totalViagem: 3871.50
  },
  {
    id: '3',
    documentNumber: 'DOC-2025-0003',
    documentType: 'outbound',
    departureDateTime: new Date('2025-04-30T09:00:00'),
    arrivalDateTime: new Date('2025-05-01T15:00:00'),
    driverName: 'Paulo Ferreira',
    truckId: 'JKL-9012',
    trailer1: 'MNO-6543',
    trailer2: '',
    trailerType: 'Sider',
    issuerUser: 'Carla Lima',
    checkerUser: 'Roberto Santos',
    transporterName: 'Expressa Transportes',
    transporterLogo: '',
    status: 'entregue',
    dataEmissao: new Date('2025-04-29T14:20:00'),
    dataEntrega: new Date('2025-05-01T16:15:00'),
    totalViagem: 7198.25
  },
  {
    id: '4',
    documentNumber: 'DOC-2025-0004',
    documentType: 'inbound',
    departureDateTime: new Date('2025-05-06T11:00:00'),
    arrivalDateTime: new Date('2025-05-07T17:00:00'),
    driverName: 'Márcio Souza',
    truckId: 'PQR-3456',
    trailer1: 'STU-8901',
    trailer2: '',
    trailerType: 'Grade Baixa',
    issuerUser: 'Sandra Costa',
    checkerUser: '',
    transporterName: 'Transportes do Vale',
    transporterLogo: '',
    status: 'pendente',
    dataEmissao: new Date('2025-05-05T09:15:00'),
    totalViagem: 4250.30
  },
  {
    id: '5',
    documentNumber: 'DOC-2025-0005',
    documentType: 'outbound',
    departureDateTime: new Date('2025-05-05T07:30:00'),
    arrivalDateTime: new Date('2025-05-06T12:30:00'),
    driverName: 'Antônio Ribeiro',
    truckId: 'VWX-7890',
    trailer1: 'YZA-2345',
    trailer2: 'BCD-6789',
    trailerType: 'Carreta',
    issuerUser: 'Fernanda Silva',
    checkerUser: 'Lucas Martins',
    transporterName: 'Rodoviária Central',
    transporterLogo: '',
    status: 'entregue',
    dataEmissao: new Date('2025-05-04T16:30:00'),
    dataEntrega: new Date('2025-05-06T13:40:00'),
    totalViagem: 9345.78
  }
];

export const useFaturamentoDocumentos = () => {
  const [documentos, setDocumentos] = useState<DocumentoFaturamento[]>(mockDocumentos);
  
  // Filtragem de documentos por status
  const documentosAConferir = documentos.filter(doc => doc.status === 'pendente');
  const documentosEmTransito = documentos.filter(doc => doc.status === 'transito');
  const documentosEntregues = documentos.filter(doc => doc.status === 'entregue');

  const marcarComoConferido = (id: string) => {
    setDocumentos(docs => docs.map(doc => 
      doc.id === id 
        ? { ...doc, status: 'transito' as const, checkerUser: 'Usuário Atual' }
        : doc
    ));
    
    toast({
      title: "Documento conferido com sucesso",
      description: `Documento ${id} marcado como em trânsito.`
    });
  };

  const marcarComoEntregue = (id: string) => {
    setDocumentos(docs => docs.map(doc => 
      doc.id === id 
        ? { 
            ...doc, 
            status: 'entregue' as const, 
            dataEntrega: new Date()
          }
        : doc
    ));
    
    toast({
      title: "Documento finalizado com sucesso",
      description: `Documento ${id} marcado como entregue.`
    });
  };

  const adicionarNovoDocumento = (documento: DocumentInfo, totalViagem: number) => {
    const novoDocumento: DocumentoFaturamento = {
      ...documento,
      id: `${documentos.length + 1}`,
      status: 'pendente',
      dataEmissao: new Date(),
      totalViagem
    };
    
    setDocumentos(prev => [...prev, novoDocumento]);
    return novoDocumento.id;
  };

  return {
    documentos,
    documentosAConferir,
    documentosEmTransito,
    documentosEntregues,
    marcarComoConferido,
    marcarComoEntregue,
    adicionarNovoDocumento
  };
};
