
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface NotaFiscal {
  id: string;
  numero: string;
  remetente: string;
  cliente: string;
  pedido?: string;
  dataEmissao: string;
  valor: number;
  pesoBruto: number;
}

export interface OrdemCarregamento {
  id: string;
  cliente: string;
  tipoCarregamento: string;
  dataCarregamento: string;
  transportadora: string;
  placaVeiculo: string;
  motorista: string;
  observacoes?: string;
  status: 'pending' | 'processing' | 'completed';
  notasFiscais?: NotaFiscal[];
}

interface CreateOCFormData {
  cliente: string;
  tipoCarregamento: string;
  dataCarregamento: string;
  transportadora: string;
  placaVeiculo: string;
  motorista: string;
  observacoes?: string;
}

export const useOrdemCarregamento = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ordensCarregamento, setOrdensCarregamento] = useState<OrdemCarregamento[]>([]);
  const [notasFiscaisDisponiveis, setNotasFiscaisDisponiveis] = useState<NotaFiscal[]>([]);

  // Mock function to create a new ordem carregamento
  const createOrdemCarregamento = async (data: CreateOCFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a random ID
      const newOC: OrdemCarregamento = {
        id: `OC-${Math.floor(1000 + Math.random() * 9000)}`,
        ...data,
        status: 'pending',
      };
      
      // Add to local state
      setOrdensCarregamento(prev => [...prev, newOC]);
      
      toast({
        title: "Ordem de Carregamento criada",
        description: `OC ${newOC.id} criada com sucesso.`,
      });
      
      return newOC;
    } catch (error) {
      console.error('Error creating OC:', error);
      toast({
        title: "Erro ao criar Ordem de Carregamento",
        description: "Ocorreu um erro ao criar a OC. Tente novamente.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get available notas fiscais
  const fetchNotasFiscaisDisponiveis = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for available notas fiscais
      const mockNotas: NotaFiscal[] = [
        { 
          id: 'NF-2023-001', 
          numero: '12345', 
          remetente: 'Fornecedor ABC', 
          cliente: 'Cliente XYZ', 
          pedido: 'PED-001',
          dataEmissao: '15/05/2023', 
          valor: 1250.00,
          pesoBruto: 120.5
        },
        { 
          id: 'NF-2023-002', 
          numero: '12346', 
          remetente: 'Fornecedor DEF', 
          cliente: 'Cliente MNO', 
          pedido: 'PED-002',
          dataEmissao: '16/05/2023', 
          valor: 2345.67,
          pesoBruto: 210.3
        },
        { 
          id: 'NF-2023-003', 
          numero: '12347', 
          remetente: 'Fornecedor GHI', 
          cliente: 'Cliente PQR', 
          pedido: 'PED-003',
          dataEmissao: '17/05/2023', 
          valor: 3456.78,
          pesoBruto: 315.7
        },
      ];
      
      setNotasFiscaisDisponiveis(mockNotas);
      return mockNotas;
    } catch (error) {
      console.error('Error fetching notas fiscais:', error);
      toast({
        title: "Erro ao buscar Notas Fiscais",
        description: "Ocorreu um erro ao buscar as notas fiscais disponíveis.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Function to import notas fiscais to an ordem carregamento
  const importarNotasFiscais = async (ordemId: string, notasIds: string[]) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the selected notas
      const notasSelecionadas = notasFiscaisDisponiveis.filter(nota => 
        notasIds.includes(nota.id)
      );
      
      // Update the ordem carregamento with the selected notas
      setOrdensCarregamento(prev => 
        prev.map(oc => {
          if (oc.id === ordemId) {
            return {
              ...oc,
              notasFiscais: [...(oc.notasFiscais || []), ...notasSelecionadas]
            };
          }
          return oc;
        })
      );
      
      toast({
        title: "Notas Fiscais importadas",
        description: `${notasSelecionadas.length} notas fiscais foram importadas com sucesso.`,
      });
      
      return notasSelecionadas;
    } catch (error) {
      console.error('Error importing notas fiscais:', error);
      toast({
        title: "Erro ao importar Notas Fiscais",
        description: "Ocorreu um erro ao importar as notas fiscais.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get ordensCarregamento
  const fetchOrdensCarregamento = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for ordens carregamento
      const mockOrdens: OrdemCarregamento[] = [
        { 
          id: 'OC-2023-001', 
          cliente: 'Cliente XYZ', 
          tipoCarregamento: 'entrega',
          dataCarregamento: '15/05/2023',
          transportadora: 'Transportadora A',
          placaVeiculo: 'ABC1234',
          motorista: 'João Silva',
          observacoes: 'Entregar com urgência',
          status: 'pending'
        },
        { 
          id: 'OC-2023-002', 
          cliente: 'Cliente MNO', 
          tipoCarregamento: 'transferencia',
          dataCarregamento: '16/05/2023',
          transportadora: 'Transportadora B',
          placaVeiculo: 'DEF5678',
          motorista: 'Maria Oliveira',
          status: 'processing'
        },
        { 
          id: 'OC-2023-003', 
          cliente: 'Cliente PQR', 
          tipoCarregamento: 'devolucao',
          dataCarregamento: '17/05/2023',
          transportadora: 'Transportadora C',
          placaVeiculo: 'GHI9012',
          motorista: 'Carlos Santos',
          observacoes: 'Material com defeito',
          status: 'completed'
        },
      ];
      
      setOrdensCarregamento(mockOrdens);
      return mockOrdens;
    } catch (error) {
      console.error('Error fetching ordens carregamento:', error);
      toast({
        title: "Erro ao buscar Ordens de Carregamento",
        description: "Ocorreu um erro ao buscar as ordens de carregamento.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Function to initiate carregamento
  const iniciarCarregamento = (ordemId: string) => {
    setOrdensCarregamento(prev => 
      prev.map(oc => {
        if (oc.id === ordemId) {
          return {
            ...oc,
            status: 'processing'
          };
        }
        return oc;
      })
    );
    
    toast({
      title: "Carregamento iniciado",
      description: `Carregamento da OC ${ordemId} iniciado com sucesso.`,
    });
  };

  return {
    isLoading,
    ordensCarregamento,
    notasFiscaisDisponiveis,
    createOrdemCarregamento,
    fetchNotasFiscaisDisponiveis,
    importarNotasFiscais,
    fetchOrdensCarregamento,
    iniciarCarregamento
  };
};
