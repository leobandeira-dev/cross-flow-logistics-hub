
import React from 'react';
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

// Schema for form validation
const empresaSchema = z.object({
  cnpj: z.string().min(18, 'CNPJ inválido').max(18, 'CNPJ inválido'),
  razao_social: z.string().min(3, 'Razão social deve ter pelo menos 3 caracteres'),
  nome_fantasia: z.string().min(2, 'Nome fantasia deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  cidade: z.string().min(2, 'Cidade inválida'),
  estado: z.string().length(2, 'Estado deve ter 2 caracteres (sigla)'),
  cep: z.string().length(9, 'CEP inválido'),
  transportadora_principal_id: z.string().optional(),
  perfis: z.array(z.string()).min(1, 'Selecione pelo menos um perfil'),
});

type EmpresaFormValues = z.infer<typeof empresaSchema>;

interface EmpresaFormProps {
  empresa?: Partial<Empresa>;
  onSubmit: (data: Partial<Empresa>) => void;
}

const perfisList = [
  { value: 'transportadora', label: 'Transportadora' },
  { value: 'filial', label: 'Filial' },
  { value: 'cliente_direto', label: 'Cliente Direto' },
  { value: 'cliente_indireto', label: 'Cliente Indireto' },
];

const EmpresaForm: React.FC<EmpresaFormProps> = ({ empresa, onSubmit }) => {
  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      cnpj: empresa?.cnpj || '',
      razao_social: empresa?.razao_social || '',
      nome_fantasia: empresa?.nome_fantasia || '',
      email: empresa?.email || '',
      telefone: empresa?.telefone || '',
      endereco: empresa?.endereco || '',
      cidade: empresa?.cidade || '',
      estado: empresa?.estado || '',
      cep: empresa?.cep || '',
      transportadora_principal_id: empresa?.transportadora_principal_id || '',
      perfis: empresa?.perfis || [],
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
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="00.000.000/0000-00" 
                    {...field} 
                    onChange={handleCNPJChange}
                    maxLength={18}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="razao_social"
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
            name="nome_fantasia"
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
            name="endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, Número, Bairro" {...field} />
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
            name="estado"
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
          <h3 className="font-medium mb-2">Perfis da Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perfisList.map((perfil) => (
              <FormField
                key={perfil.value}
                control={form.control}
                name="perfis"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={perfil.value}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(perfil.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, perfil.value])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== perfil.value
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {perfil.label}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
          </div>
          <FormMessage>{form.formState.errors.perfis?.message}</FormMessage>
        </div>

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
