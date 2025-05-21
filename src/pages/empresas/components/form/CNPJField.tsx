
import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UseFormReturn } from 'react-hook-form';
import { consultarCNPJComAlternativa, formatarCNPJ, mapearDadosParaFormulario } from '@/services/cnpjService';

interface CNPJFieldProps {
  form: UseFormReturn<any>;
}

const CNPJField: React.FC<CNPJFieldProps> = ({ form }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      value = value
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    e.target.value = value;
    form.setValue('cnpj', value);
  };

  const handleBuscarCNPJ = async () => {
    const cnpj = form.getValues('cnpj');
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    
    if (cnpjLimpo.length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "O CNPJ deve conter 14 dígitos.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Usando a função alternativa que tenta múltiplos métodos
      const dados = await consultarCNPJComAlternativa(cnpjLimpo);
      
      if (dados.status === 'ERROR') {
        throw new Error(dados.message || 'CNPJ não encontrado');
      }
      
      console.log("Dados recebidos da API:", dados);
      
      const dadosFormulario = mapearDadosParaFormulario(dados);
      console.log("Dados mapeados para o formulário:", dadosFormulario);
      
      // Atualizar os campos do formulário com os dados recebidos
      Object.entries(dadosFormulario).forEach(([campo, valor]) => {
        if (valor) {
          form.setValue(campo as any, valor);
        }
      });
      
      toast({
        title: "Dados carregados",
        description: `Dados da empresa ${dados.nome} carregados com sucesso.`,
      });
    } catch (error: any) {
      console.error("Erro completo:", error);
      toast({
        title: "Erro ao buscar CNPJ",
        description: error.message || "Não foi possível obter os dados do CNPJ.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="cnpj"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>CNPJ</FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <Input 
                placeholder="00.000.000/0000-00" 
                {...field} 
                onChange={handleCNPJChange}
                maxLength={18}
              />
            </FormControl>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBuscarCNPJ}
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Search className="h-4 w-4 mr-1" />}
              {isLoading ? "Buscando..." : "Buscar CNPJ"}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CNPJField;
