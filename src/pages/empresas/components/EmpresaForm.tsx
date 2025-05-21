import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Empresa, PerfilEmpresa } from '../types/empresa.types';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { consultarCNPJ, formatarCNPJ, limparCNPJ, mapearDadosParaFormulario, consultarCNPJComAlternativa } from '@/services/cnpjService';

// Schema for form validation
const empresaSchema = z.object({
  cnpj: z.string().min(18, 'CNPJ inválido').max(18, 'CNPJ inválido'),
  razaoSocial: z.string().min(3, 'Razão social deve ter pelo menos 3 caracteres'),
  nomeFantasia: z.string().min(2, 'Nome fantasia deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  logradouro: z.string().min(5, 'Logradouro deve ter pelo menos 5 caracteres'),
  numero: z.string().min(1, 'Número é obrigatório'),
  bairro: z.string().min(2, 'Bairro é obrigatório'),
  cidade: z.string().min(2, 'Cidade inválida'),
  uf: z.string().length(2, 'Estado deve ter 2 caracteres (sigla)'),
  cep: z.string().length(9, 'CEP inválido'),
  transportadoraPrincipal: z.boolean().optional(),
  perfil: z.string().min(1, 'Selecione um perfil'),
});

type EmpresaFormValues = z.infer<typeof empresaSchema>;

interface EmpresaFormProps {
  empresa?: Partial<Empresa>;
  onSubmit: (data: Partial<Empresa>) => void;
}

const perfisList = [
  { value: 'Transportadora', label: 'Transportadora' },
  { value: 'Filial', label: 'Filial' },
  { value: 'Cliente', label: 'Cliente' },
  { value: 'Fornecedor', label: 'Fornecedor' },
];

const EmpresaForm: React.FC<EmpresaFormProps> = ({ empresa, onSubmit }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      cnpj: empresa?.cnpj || '',
      razaoSocial: empresa?.razaoSocial || '',
      nomeFantasia: empresa?.nomeFantasia || '',
      email: empresa?.email || '',
      telefone: empresa?.telefone || '',
      logradouro: empresa?.logradouro || '',
      numero: empresa?.numero || '',
      bairro: empresa?.bairro || '',
      cidade: empresa?.cidade || '',
      uf: empresa?.uf || '',
      cep: empresa?.cep || '',
      transportadoraPrincipal: empresa?.transportadoraPrincipal || false,
      perfil: empresa?.perfil || '',
    },
  });

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
    const cnpjLimpo = limparCNPJ(cnpj);
    
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

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
    form.setValue('cep', value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length > 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      }
      if (value.length > 10) {
        value = value.replace(/\)\s(\d{5})/, ') $1-');
      }
    }
    e.target.value = value;
    form.setValue('telefone', value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="razaoSocial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razão Social</FormLabel>
                <FormControl>
                  <Input placeholder="Razão Social da Empresa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nomeFantasia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Fantasia</FormLabel>
                <FormControl>
                  <Input placeholder="Nome Fantasia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="empresa@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(00) 00000-0000" 
                    {...field} 
                    onChange={handlePhoneChange}
                    maxLength={15}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logradouro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logradouro</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, Avenida, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="Nº" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="UF" {...field} maxLength={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="00000-000" 
                    {...field} 
                    onChange={handleCEPChange}
                    maxLength={9}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">Perfil da Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perfisList.map((perfilOption) => (
              <FormField
                key={perfilOption.value}
                control={form.control}
                name="perfil"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={perfilOption.value}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value === perfilOption.value}
                          onCheckedChange={() => {
                            form.setValue('perfil', perfilOption.value);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {perfilOption.label}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
          </div>
          <FormMessage>{form.formState.errors.perfil?.message}</FormMessage>
        </div>

        <FormField
          control={form.control}
          name="transportadoraPrincipal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Transportadora Principal
                </FormLabel>
                <FormDescription>
                  Marque esta opção se esta empresa for a transportadora principal
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="bg-cross-blue hover:bg-cross-blueDark"
        >
          Cadastrar Empresa
        </Button>
      </form>
    </Form>
  );
};

export default EmpresaForm;
