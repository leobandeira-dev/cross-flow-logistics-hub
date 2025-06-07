import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, User, Building, RefreshCw } from 'lucide-react';

const userSchema = z.object({
  nome: z.string().min(3, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  empresa: z.string().min(2, { message: 'Empresa é obrigatória' }),
  cnpj: z.string().min(14, { message: 'CNPJ inválido' }).max(18),
  perfil: z.string({ required_error: 'Selecione um perfil' }),
});

type UserFormValues = z.infer<typeof userSchema>;

interface CadastroFormProps {
  onSubmit: (data: UserFormValues) => void;
}

// Mock função para buscar empresa por CNPJ
const fetchEmpresaByCNPJ = async (cnpj: string): Promise<any> => {
  // Simulando delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  return {
    nome: 'Empresa ' + cnpj.substr(0, 5),
    endereco: 'Rua Exemplo, 123',
    cidade: 'São Paulo',
    estado: 'SP',
  };
};

export const CadastroForm: React.FC<CadastroFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cadastroMethod, setCadastroMethod] = useState<'email' | 'google'>('email');
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: '',
      email: '',
      empresa: '',
      cnpj: '',
      perfil: '',
    },
  });

  const handleSubmit = (data: UserFormValues) => {
    onSubmit(data);
    form.reset();
  };

  const handleCNPJBlur = async () => {
    const cnpj = form.getValues('cnpj');
    if (cnpj && cnpj.length >= 14) {
      setIsLoading(true);
      try {
        const empresa = await fetchEmpresaByCNPJ(cnpj);
        form.setValue('empresa', empresa.nome);
      } catch (error) {
        console.error('Erro ao buscar empresa:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <Tabs value={cadastroMethod} onValueChange={(value: string) => setCadastroMethod(value as 'email' | 'google')}>
        <TabsList className="mb-6">
          <TabsTrigger value="email">Cadastro com Email</TabsTrigger>
          <TabsTrigger value="google">Cadastro com Google</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-gray-100 p-2 flex items-center justify-center border border-r-0 rounded-l">
                            <User size={18} className="text-gray-500" />
                          </div>
                          <Input {...field} className="rounded-l-none" />
                        </div>
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-gray-100 p-2 flex items-center justify-center border border-r-0 rounded-l">
                            <Mail size={18} className="text-gray-500" />
                          </div>
                          <Input {...field} type="email" className="rounded-l-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-gray-100 p-2 flex items-center justify-center border border-r-0 rounded-l">
                            <Building size={18} className="text-gray-500" />
                          </div>
                          <Input 
                            {...field} 
                            className="rounded-l-none" 
                            onBlur={handleCNPJBlur}
                          />
                          {isLoading && (
                            <div className="bg-gray-100 p-2 flex items-center justify-center border border-l-0 rounded-r">
                              <RefreshCw size={18} className="text-gray-500 animate-spin" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="empresa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-gray-100 p-2 flex items-center justify-center border border-r-0 rounded-l">
                            <Building size={18} className="text-gray-500" />
                          </div>
                          <Input {...field} className="rounded-l-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="perfil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um perfil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cliente">Cliente</SelectItem>
                          <SelectItem value="Administrador">Administrador</SelectItem>
                          <SelectItem value="Operador">Operador</SelectItem>
                          <SelectItem value="Financeiro">Financeiro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Limpar
                </Button>
                <Button type="submit">
                  Cadastrar
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="google">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Faça login com sua conta Google para um cadastro mais rápido
                </p>
                <Button variant="outline" className="w-full max-w-sm">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar com Google
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CadastroForm;
