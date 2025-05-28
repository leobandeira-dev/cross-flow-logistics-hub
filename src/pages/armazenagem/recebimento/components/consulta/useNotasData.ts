
import { useState, useEffect } from 'react';
import { NotaFiscal } from '@/types/supabase.types';
import { buscarNotasFiscais } from '@/services/notaFiscal/fetchNotaFiscalService';
import { useToast } from '@/hooks/use-toast';

export const useNotasData = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarNotasFiscais = async () => {
      try {
        setIsLoading(true);
        console.log('Carregando notas fiscais do Supabase...');
        
        const filtros: any = {};
        
        // Aplicar filtros de status
        if (activeFilters.Status && activeFilters.Status.length > 0 && !activeFilters.Status.includes('all')) {
          filtros.status = activeFilters.Status[0];
        }
        
        // Aplicar filtro de termo de busca
        if (searchTerm.trim()) {
          filtros.termo = searchTerm.trim();
        }
        
        const notas = await buscarNotasFiscais(filtros);
        console.log('Notas fiscais carregadas:', notas);
        setNotasFiscais(notas);
      } catch (error) {
        console.error('Erro ao carregar notas fiscais:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar notas fiscais. Tente novamente.",
          variant: "destructive"
        });
        setNotasFiscais([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarNotasFiscais();
  }, [searchTerm, activeFilters, toast]);

  const handleSearch = (value: string, filters?: Record<string, string[]>) => {
    setSearchTerm(value);
    if (filters) {
      setActiveFilters(filters);
    }
  };

  return {
    notasFiscais,
    isLoading,
    handleSearch
  };
};
