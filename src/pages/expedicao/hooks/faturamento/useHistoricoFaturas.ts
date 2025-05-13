
import { useState, useEffect } from 'react';
import { NotaFiscal } from '../../Faturamento';

// Mock data interface for historical invoices
interface Fatura {
  id: string;
  data: Date;
  cabecalho: {
    numeroDocumento?: string;
    tipoDocumento?: string;
    previsaoSaida?: Date;
    previsaoChegada?: Date;
    motoristaNome?: string;
    veiculoCavalo?: string;
    veiculoCarreta1?: string;
    veiculoCarreta2?: string;
    tipoCarroceria?: string;
    usuarioEmissor?: string;
    usuarioConferente?: string;
    transportadora?: string;
    transportadoraLogo?: string;
  };
  notas: NotaFiscal[];
  totais: {
    pesoTotal: number;
    freteTotal: number;
    expressoTotal: number;
    icmsTotal: number;
    totalViagem: number;
  };
}

// Mock data for faturas - in a real app this would come from an API or database
const mockFaturas: Fatura[] = [
  {
    id: '1',
    data: new Date(2023, 4, 15),
    cabecalho: {
      numeroDocumento: '150523-1',
      tipoDocumento: 'Outbound',
      previsaoSaida: new Date(2023, 4, 16, 8, 0),
      previsaoChegada: new Date(2023, 4, 17, 14, 0),
      motoristaNome: 'João Silva',
      veiculoCavalo: 'ABC-1234',
      veiculoCarreta1: 'XYZ-5678',
      tipoCarroceria: 'Baú',
      usuarioEmissor: 'Carlos Oliveira',
      usuarioConferente: 'Maria Santos',
      transportadora: 'Transportes Rápidos LTDA',
    },
    notas: [
      {
        id: '101',
        data: new Date(2023, 4, 14),
        cliente: 'Empresa A LTDA',
        pesoNota: 1250.5,
        fretePorTonelada: 120,
        pesoMinimo: 1000,
        aliquotaICMS: 12,
        aliquotaExpresso: 10,
        fretePeso: 150.06,
        valorExpresso: 15.01,
        notaFiscal: 'NF-45678',
      },
      {
        id: '102',
        data: new Date(2023, 4, 14),
        cliente: 'Empresa B S.A.',
        pesoNota: 2300.75,
        fretePorTonelada: 120,
        pesoMinimo: 1000,
        aliquotaICMS: 12,
        aliquotaExpresso: 10,
        fretePeso: 276.09,
        valorExpresso: 27.61,
        notaFiscal: 'NF-87654',
      }
    ],
    totais: {
      pesoTotal: 3551.25,
      freteTotal: 426.15,
      expressoTotal: 42.62,
      icmsTotal: 51.14,
      totalViagem: 519.91
    }
  },
  {
    id: '2',
    data: new Date(2023, 4, 20),
    cabecalho: {
      numeroDocumento: '200523-1',
      tipoDocumento: 'Inbound',
      previsaoSaida: new Date(2023, 4, 21, 9, 30),
      previsaoChegada: new Date(2023, 4, 22, 16, 45),
      motoristaNome: 'Pedro Alves',
      veiculoCavalo: 'DEF-5678',
      veiculoCarreta1: 'JKL-9101',
      tipoCarroceria: 'Sider',
      usuarioEmissor: 'Ana Lima',
      usuarioConferente: 'Roberto Dias',
      transportadora: 'Logística Eficiente S.A.',
    },
    notas: [
      {
        id: '201',
        data: new Date(2023, 4, 19),
        cliente: 'Distribuidora XYZ',
        pesoNota: 3500,
        fretePorTonelada: 130,
        pesoMinimo: 1000,
        aliquotaICMS: 12,
        aliquotaExpresso: 8,
        fretePeso: 455,
        valorExpresso: 36.4,
        notaFiscal: 'NF-12345',
      }
    ],
    totais: {
      pesoTotal: 3500,
      freteTotal: 455,
      expressoTotal: 36.4,
      icmsTotal: 54.6,
      totalViagem: 546
    }
  }
];

export const useHistoricoFaturas = () => {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [allFaturas, setAllFaturas] = useState<Fatura[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulating API fetch on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API delay
        
        setFaturas(mockFaturas);
        setAllFaturas(mockFaturas);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching faturas:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search function
  const searchFaturas = (term: string) => {
    if (!term.trim()) {
      setFaturas(allFaturas);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = allFaturas.filter(fatura => 
      (fatura.cabecalho?.numeroDocumento?.toLowerCase().includes(lowerTerm) || false) ||
      (fatura.cabecalho?.transportadora?.toLowerCase().includes(lowerTerm) || false) ||
      (fatura.id.toLowerCase().includes(lowerTerm)) ||
      (fatura.notas.some(nota => 
        (nota.cliente?.toLowerCase().includes(lowerTerm) || false) ||
        (nota.notaFiscal?.toLowerCase().includes(lowerTerm) || false)
      ))
    );
    
    setFaturas(filtered);
  };

  // Add a fatura to history
  const addFatura = (newFatura: Fatura) => {
    setFaturas(prev => [newFatura, ...prev]);
    setAllFaturas(prev => [newFatura, ...prev]);
  };

  return {
    faturas,
    isLoading,
    searchFaturas,
    addFatura
  };
};

export type { Fatura };
