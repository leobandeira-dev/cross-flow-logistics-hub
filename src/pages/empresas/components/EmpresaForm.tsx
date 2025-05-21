
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Empresa } from '../types/empresa.types';
import CNPJField from './form/CNPJField';
import BasicInfoFields from './form/BasicInfoFields';
import AddressFields from './form/AddressFields';
import CompanyProfileFields from './form/CompanyProfileFields';

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* CNPJ Search Section */}
        <div className="mb-2">
          <CNPJField form={form} />
        </div>
        
        {/* Basic Information Section */}
        <div className="mb-4">
          <h3 className="font-medium mb-3">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BasicInfoFields form={form} />
          </div>
        </div>
        
        {/* Address Section */}
        <div className="mb-4">
          <h3 className="font-medium mb-3">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AddressFields form={form} />
          </div>
        </div>
        
        {/* Profile Section */}
        <div className="mb-4">
          <CompanyProfileFields form={form} perfisList={perfisList} />
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
