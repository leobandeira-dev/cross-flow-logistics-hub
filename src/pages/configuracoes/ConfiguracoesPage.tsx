
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Save, Settings, Bell, ShieldCheck, Printer, Globe, User } from 'lucide-react';

const ConfiguracoesPage: React.FC = () => {
  return (
    <MainLayout title="Configurações">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Configurações do Sistema</h2>
        <p className="text-gray-600">Personalize o comportamento do sistema conforme suas necessidades</p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="geral" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Geral
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notificações
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Segurança
          </TabsTrigger>
          <TabsTrigger value="impressao" className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Impressão
          </TabsTrigger>
          <TabsTrigger value="integracao" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Integrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Defina as configurações básicas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input id="company-name" defaultValue="Logística Express Ltda." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-zone">Fuso Horário</Label>
                    <Select defaultValue="america-sao_paulo">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o fuso horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-sao_paulo">América/São Paulo</SelectItem>
                        <SelectItem value="america-manaus">América/Manaus</SelectItem>
                        <SelectItem value="america-recife">América/Recife</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma Principal</Label>
                    <Select defaultValue="pt_BR">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt_BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en_US">English (US)</SelectItem>
                        <SelectItem value="es_ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moeda</Label>
                    <Select defaultValue="BRL">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a moeda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-format">Formato de Data</Label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato de data" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-base">Modo Escuro</Label>
                    <p className="text-sm text-gray-500">Ativar modo escuro na interface</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-logout" className="text-base">Logout Automático</Label>
                    <p className="text-sm text-gray-500">Desconectar após 30 minutos de inatividade</p>
                  </div>
                  <Switch id="auto-logout" defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Gerencie como você recebe alertas e notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">Notificações por Email</Label>
                    <p className="text-sm text-gray-500">Receber alertas importantes por email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="browser-notifications" className="text-base">Notificações no Navegador</Label>
                    <p className="text-sm text-gray-500">Exibir alertas no navegador</p>
                  </div>
                  <Switch id="browser-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications" className="text-base">Notificações por SMS</Label>
                    <p className="text-sm text-gray-500">Receber alertas críticos por SMS</p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="notification-frequency">Frequência das Notificações</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Imediato</SelectItem>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Resumo diário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Ajuste as configurações de segurança da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor" className="text-base">Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-gray-500">Aumenta a segurança da sua conta</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session-history" className="text-base">Histórico de Sessões</Label>
                    <p className="text-sm text-gray-500">Acompanhar histórico de logins</p>
                  </div>
                  <Switch id="session-history" defaultChecked />
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full md:w-auto">
                    <User className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="impressao">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Impressão</CardTitle>
              <CardDescription>Defina as preferências para impressão de documentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-printer">Impressora Padrão</Label>
                  <Select defaultValue="local">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a impressora padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Impressora Local</SelectItem>
                      <SelectItem value="network">Impressora de Rede</SelectItem>
                      <SelectItem value="pdf">Gerar PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paper-size">Tamanho do Papel</Label>
                  <Select defaultValue="a4">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tamanho do papel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Carta (Letter)</SelectItem>
                      <SelectItem value="legal">Ofício (Legal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="include-header-footer" className="text-base">Incluir Cabeçalho e Rodapé</Label>
                    <p className="text-sm text-gray-500">Adicionar informações da empresa na impressão</p>
                  </div>
                  <Switch id="include-header-footer" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="print-preview" className="text-base">Exibir Prévia de Impressão</Label>
                    <p className="text-sm text-gray-500">Mostrar prévia antes de imprimir</p>
                  </div>
                  <Switch id="print-preview" defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integracao">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>Configure a integração com outros sistemas e serviços</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="api-integration" className="text-base">API Externa</Label>
                    <p className="text-sm text-gray-500">Permitir acesso via API</p>
                  </div>
                  <Switch id="api-integration" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-key">Chave de API</Label>
                  <div className="flex space-x-2">
                    <Input id="api-key" value="sk_test_51IBlq3JeX6kHR1S3jd2hJ72j" readOnly className="font-mono" />
                    <Button variant="outline">Gerar Nova</Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Essa chave dá acesso completo à sua conta. Mantenha-a segura!</p>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input id="webhook-url" placeholder="https://seu-sistema.com/webhook" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="integration-service">Serviço de Integração</Label>
                  <Select defaultValue="erp">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="erp">Sistema ERP</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ConfiguracoesPage;
