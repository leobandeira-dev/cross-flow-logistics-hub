
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Clock, Calendar, CheckSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const notaFiscalSchema = z.object({
  // Dados da Nota Fiscal
  chaveNF: z.string().optional(),
  dataHoraEmissao: z.string().optional(),
  numeroNF: z.string().optional(),
  serieNF: z.string().optional(),
  tipoOperacao: z.string().optional(),
  
  // Dados do Emitente
  emitenteCNPJ: z.string().optional(),
  emitenteRazaoSocial: z.string().optional(),
  emitenteTelefone: z.string().optional(),
  emitenteUF: z.string().optional(),
  emitenteCidade: z.string().optional(),
  emitenteBairro: z.string().optional(),
  emitenteEndereco: z.string().optional(),
  emitenteNumero: z.string().optional(),
  emitenteCEP: z.string().optional(),
  
  // Dados do Destinatário
  destinatarioCNPJ: z.string().optional(),
  destinatarioRazaoSocial: z.string().optional(),
  destinatarioTelefone: z.string().optional(),
  destinatarioUF: z.string().optional(),
  destinatarioCidade: z.string().optional(),
  destinatarioBairro: z.string().optional(),
  destinatarioEndereco: z.string().optional(),
  destinatarioNumero: z.string().optional(),
  destinatarioCEP: z.string().optional(),
  
  // Totais da Nota
  valorTotal: z.string().optional(),
  pesoTotalBruto: z.string().optional(),
  volumesTotal: z.string().optional(),
  numeroPedido: z.string().optional(),
  informacoesComplementares: z.string().optional(),
  
  // Campos adicionais
  entregueAoFornecedor: z.string().optional(),
  fobCif: z.string().optional(),
  numeroColeta: z.string().optional(),
  valorColeta: z.string().optional(),
  numeroCTeColeta: z.string().optional(),
  numeroCTeViagem: z.string().optional(),
  dataHoraEntrada: z.string().optional(),
  statusEmbarque: z.string().optional(),
  quimico: z.string().optional(),
  fracionado: z.string().optional(),
  responsavelEntrega: z.string().optional(),
  motorista: z.string().optional(),
  dataEmbarque: z.string().optional(),
});

type NotaFiscalSchemaType = z.infer<typeof notaFiscalSchema>;

const NotaFiscalForm: React.FC = () => {
  const form = useForm<NotaFiscalSchemaType>({
    resolver: zodResolver(notaFiscalSchema),
    defaultValues: {
      chaveNF: '',
      dataHoraEmissao: '',
      numeroNF: '',
      serieNF: '',
      tipoOperacao: '',
      emitenteCNPJ: '',
      emitenteRazaoSocial: '',
      emitenteTelefone: '',
      emitenteUF: '',
      emitenteCidade: '',
      emitenteBairro: '',
      emitenteEndereco: '',
      emitenteNumero: '',
      emitenteCEP: '',
      destinatarioCNPJ: '',
      destinatarioRazaoSocial: '',
      destinatarioTelefone: '',
      destinatarioUF: '',
      destinatarioCidade: '',
      destinatarioBairro: '',
      destinatarioEndereco: '',
      destinatarioNumero: '',
      destinatarioCEP: '',
      valorTotal: '',
      pesoTotalBruto: '',
      volumesTotal: '',
      numeroPedido: '',
      informacoesComplementares: '',
      entregueAoFornecedor: '',
      fobCif: '',
      numeroColeta: '',
      valorColeta: '',
      numeroCTeColeta: '',
      numeroCTeViagem: '',
      dataHoraEntrada: '',
      statusEmbarque: '',
      quimico: '',
      fracionado: '',
      responsavelEntrega: '',
      motorista: '',
      dataEmbarque: '',
    },
  });

  const handleSubmit = (data: NotaFiscalSchemaType) => {
    console.log('Formulário enviado:', data);
    // Aqui você pode adicionar a lógica para salvar os dados
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aqui você pode adicionar a lógica para processar o arquivo XML
      console.log('Arquivo XML selecionado:', file.name);
      // Simular preenchimento de alguns campos
      form.setValue('numeroNF', '123456');
      form.setValue('emitenteRazaoSocial', 'Empresa Exemplo');
    }
  };

  const handleKeySearch = () => {
    const chaveNF = form.getValues('chaveNF');
    if (chaveNF) {
      // Aqui você pode adicionar a lógica para buscar a nota fiscal pela chave
      console.log('Buscando nota fiscal pela chave:', chaveNF);
      // Simular preenchimento de alguns campos
      form.setValue('numeroNF', '654321');
      form.setValue('emitenteRazaoSocial', 'Fornecedor ABC');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="chave" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chave">Importar por Chave de Acesso</TabsTrigger>
            <TabsTrigger value="xml">Importar via XML</TabsTrigger>
            <TabsTrigger value="manual">Cadastro Manual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chave" className="space-y-4 py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="chaveNF"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave de Acesso da NF-e</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite a chave de acesso da nota fiscal" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleKeySearch}
                    className="bg-cross-blue hover:bg-cross-blue/90"
                  >
                    Buscar Nota
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="xml" className="space-y-4 py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Upload de Arquivo XML</FormLabel>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                          </p>
                          <p className="text-xs text-gray-500">XML (MAX. 10MB)</p>
                        </div>
                        <input 
                          id="dropzone-file" 
                          type="file" 
                          className="hidden" 
                          accept=".xml"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </FormItem>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manual" className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              Preencha todos os campos manualmente para cadastrar um documento não fiscal.
            </p>
          </TabsContent>
        </Tabs>

        {/* Seção de Dados da Nota Fiscal */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="mr-2 text-cross-blue" size={20} />
              Dados da Nota Fiscal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="numeroNF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Nota</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="serieNF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Série da Nota</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataHoraEmissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Emissão</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="tipoOperacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Operação</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0 - Entrada</SelectItem>
                        <SelectItem value="1">1 - Saída</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="entregueAoFornecedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entregue ao Fornecedor</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção de Dados do Emitente */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Dados do Emitente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="emitenteCNPJ"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emitenteRazaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emitenteTelefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="emitenteUF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emitenteCidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emitenteBairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="emitenteEndereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emitenteNumero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emitenteCEP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção de Dados do Destinatário */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Dados do Destinatário</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="destinatarioCNPJ"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destinatarioRazaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destinatarioTelefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="destinatarioUF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destinatarioCidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destinatarioBairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="destinatarioEndereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destinatarioNumero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destinatarioCEP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção de Informações Adicionais */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Informações Adicionais e Totais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="valorTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Total</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pesoTotalBruto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Total Bruto</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="volumesTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volumes Total</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="fobCif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FOB/CIF</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fob">FOB</SelectItem>
                        <SelectItem value="cif">CIF</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numeroPedido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Pedido</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 mt-4">
              <FormField
                control={form.control}
                name="informacoesComplementares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informações Complementares</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção de Informações de Coleta e Transporte */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Informações de Coleta e Transporte</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="numeroColeta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Coleta</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="valorColeta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da Coleta</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numeroCTeColeta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do CT-e Coleta</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-4">
              <FormItem>
                <FormLabel>Arquivo CT-e Coleta</FormLabel>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <Upload className="w-6 h-6 mb-1 text-gray-400" />
                      <p className="text-xs text-gray-500">Clique para fazer upload</p>
                    </div>
                    <input id="cte-file" type="file" className="hidden" />
                  </label>
                </div>
              </FormItem>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="numeroCTeViagem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do CT-e Viagem</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataEmbarque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Embarque</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-4">
              <FormItem>
                <FormLabel>Arquivo CT-e Viagem</FormLabel>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <Upload className="w-6 h-6 mb-1 text-gray-400" />
                      <p className="text-xs text-gray-500">Clique para fazer upload</p>
                    </div>
                    <input id="cte-viagem-file" type="file" className="hidden" />
                  </label>
                </div>
              </FormItem>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Informações Complementares */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Informações Complementares</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dataHoraEntrada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora de Entrada</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="statusEmbarque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Embarque</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_processamento">Em Processamento</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="responsavelEntrega"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável pela Entrega</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="transportadora">Transportadora</SelectItem>
                        <SelectItem value="fornecedor">Fornecedor</SelectItem>
                        <SelectItem value="cliente">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="quimico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Químico</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fracionado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fracionado</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motorista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motorista</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="motorista1">João Silva</SelectItem>
                        <SelectItem value="motorista2">Carlos Oliveira</SelectItem>
                        <SelectItem value="motorista3">Pedro Santos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-4">
              <FormItem>
                <FormLabel>Arquivos Diversos</FormLabel>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <Upload className="w-6 h-6 mb-1 text-gray-400" />
                      <p className="text-xs text-gray-500">Clique para fazer upload de arquivos adicionais</p>
                    </div>
                    <input id="arquivos-diversos" type="file" multiple className="hidden" />
                  </label>
                </div>
              </FormItem>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="submit" className="bg-cross-blue hover:bg-cross-blue/90">
            Cadastrar Nota Fiscal
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NotaFiscalForm;
