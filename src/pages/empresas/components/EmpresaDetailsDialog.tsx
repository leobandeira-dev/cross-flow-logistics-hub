
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil } from 'lucide-react';
import EmpresaForm from './EmpresaForm';
import { useEmpresaOperations } from '@/hooks/useEmpresaOperations';
import { Empresa } from '../types/empresa.types';

interface EmpresaDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: any;
  onSubmit?: (data: Partial<Empresa>) => void; // Added this property
}

const EmpresaDetailsDialog: React.FC<EmpresaDetailsDialogProps> = ({
  open,
  onOpenChange,
  empresa,
  onSubmit,
}) => {
  const [editMode, setEditMode] = useState(false);
  const { atualizarEmpresa, isLoading } = useEmpresaOperations();

  if (!empresa) {
    return null;
  }

  // Mapear os dados da empresa para o formato esperado pelo formulário
  const empresaFormData = {
    id: empresa.id,
    cnpj: empresa.cnpj,
    razaoSocial: empresa.razaoSocial || empresa.razao_social,
    nomeFantasia: empresa.nomeFantasia || empresa.nome_fantasia,
    email: empresa.email,
    telefone: empresa.telefone,
    logradouro: empresa.logradouro,
    numero: empresa.numero,
    complemento: empresa.complemento,
    bairro: empresa.bairro,
    cidade: empresa.cidade,
    uf: empresa.uf || empresa.estado,
    cep: empresa.cep,
    inscricaoEstadual: empresa.inscricaoEstadual || empresa.inscricao_estadual,
    perfil: empresa.perfil,
    transportadoraPrincipal: empresa.transportadoraPrincipal || empresa.transportadora_principal,
  };

  const handleSubmit = async (data: any) => {
    const success = await atualizarEmpresa(empresa.id, data);
    if (success) {
      setEditMode(false);
      // If there's an onSubmit callback, call it
      if (onSubmit) {
        onSubmit(data);
      }
    }
  };

  const renderContactInfo = () => (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">E-mail</h4>
          <p>{empresa.email || 'Não informado'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
          <p>{empresa.telefone || 'Não informado'}</p>
        </div>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-4 mt-4">
      <div>
        <h4 className="text-sm font-medium text-gray-500">Endereço Completo</h4>
        <p>
          {empresa.logradouro ? `${empresa.logradouro}, ${empresa.numero || 's/n'}` : 'Endereço não informado'}
          {empresa.complemento && ` - ${empresa.complemento}`}
          {empresa.bairro && `, ${empresa.bairro}`}
        </p>
        <p>
          {empresa.cidade && empresa.cidade}
          {empresa.uf && ` - ${empresa.uf}`}
          {empresa.cep && ` - CEP: ${empresa.cep}`}
        </p>
      </div>
    </div>
  );

  const renderCompanyBasicInfo = () => (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Razão Social</h4>
            <p>{empresa.razaoSocial || empresa.razao_social}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Nome Fantasia</h4>
            <p>{empresa.nomeFantasia || empresa.nome_fantasia || 'Não informado'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">CNPJ</h4>
            <p>{empresa.cnpj}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Inscrição Estadual</h4>
            <p>{empresa.inscricaoEstadual || empresa.inscricao_estadual || 'Não informado'}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium">Perfil da Empresa</h3>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={`${empresa.perfil === 'Transportadora' ? 'bg-blue-500' : 
                              empresa.perfil === 'Filial' ? 'bg-purple-500' : 
                              empresa.perfil === 'Cliente' ? 'bg-green-500' : 'bg-amber-500'}`}>
            {empresa.perfil || 'Cliente'}
          </Badge>
          
          {(empresa.transportadoraPrincipal || empresa.transportadora_principal) && (
            <Badge className="bg-cross-blue">Transportadora Principal</Badge>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{empresa.nomeFantasia || empresa.nome_fantasia || empresa.razaoSocial || empresa.razao_social}</DialogTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setEditMode(!editMode)}
              disabled={isLoading}
            >
              <Pencil size={14} />
              {editMode ? 'Cancelar Edição' : 'Editar'}
            </Button>
          </div>
          <DialogDescription>
            CNPJ: {empresa.cnpj} | Status: {' '}
            <Badge variant={empresa.status === 'ativo' ? 'default' : 'destructive'}>
              {empresa.status === 'ativo' ? 'Ativo' : 'Inativo'}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        {editMode ? (
          <EmpresaForm empresa={empresaFormData} onSubmit={handleSubmit} />
        ) : (
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Informações Gerais</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="p-1">
              {renderCompanyBasicInfo()}
            </TabsContent>
            <TabsContent value="address" className="p-1">
              {renderAddressInfo()}
            </TabsContent>
            <TabsContent value="contact" className="p-1">
              {renderContactInfo()}
            </TabsContent>
          </Tabs>
        )}

        {!editMode && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmpresaDetailsDialog;
