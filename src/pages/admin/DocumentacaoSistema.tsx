
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Database, 
  Users, 
  Settings, 
  Truck, 
  Package, 
  ClipboardList,
  Shield,
  GitBranch,
  Monitor,
  Archive,
  Calculator
} from 'lucide-react';

const DocumentacaoSistema = () => {
  return (
    <MainLayout title="Documentação do Sistema">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Documentação Técnica do Sistema</h1>
          <p className="text-lg text-muted-foreground">
            Documentação completa para migração e desenvolvimento
          </p>
          <Badge variant="destructive" className="mt-2">
            <Shield className="w-4 h-4 mr-2" />
            Acesso Restrito - Apenas Administradores
          </Badge>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-8">
            {/* Descrição Geral */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  1. Descrição Geral do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Objetivo Principal</h3>
                  <p className="text-muted-foreground">
                    Sistema de gestão logística integrado focado em operações de armazenagem, 
                    expedição e controle de cargas, desenvolvido para transportadoras e operadores logísticos.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Resumo Funcional por Área</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium flex items-center mb-2">
                        <Archive className="w-4 h-4 mr-2" />
                        Armazenagem
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Recebimento de mercadorias com geração de etiquetas</li>
                        <li>• Movimentações internas e enderecamento</li>
                        <li>• Carregamento e conferência de cargas</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium flex items-center mb-2">
                        <Truck className="w-4 h-4 mr-2" />
                        Expedição
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Faturamento e cálculo de frete</li>
                        <li>• Emissão de documentos fiscais</li>
                        <li>• Gestão de remessas</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium flex items-center mb-2">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        SAC (Atendimento)
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Gestão de ocorrências</li>
                        <li>• Sistema de chamados</li>
                        <li>• Atendimentos diversos</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium flex items-center mb-2">
                        <Package className="w-4 h-4 mr-2" />
                        Coletas
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Solicitações de coleta</li>
                        <li>• Aprovações e alocação de cargas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Módulos e Funcionalidades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitBranch className="w-5 h-5 mr-2" />
                  2. Módulos e Funcionalidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">2.1 Módulo de Armazenagem</h3>
                    <Badge variant="outline" className="mb-2">Localização: /armazenagem</Badge>
                    
                    <div className="ml-4 space-y-3">
                      <div>
                        <h4 className="font-medium">Recebimento (/armazenagem/recebimento)</h4>
                        <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                          <li>• Consulta de notas fiscais</li>
                          <li>• Geração de etiquetas (volumes e etiquetas-mãe)</li>
                          <li>• Visualização Kanban e Lista</li>
                          <li>• Filtros por status, tipo, data</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Movimentações (/armazenagem/movimentacoes)</h4>
                        <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                          <li>• Movimentações internas</li>
                          <li>• Enderecamento de volumes</li>
                          <li>• Unitização (paletes)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Carregamento (/armazenagem/carregamento)</h4>
                        <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                          <li>• Criação de ordens de carregamento</li>
                          <li>• Conferência integrada</li>
                          <li>• Consulta de OCs existentes</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">2.2 Módulo de Expedição</h3>
                    <Badge variant="outline" className="mb-2">Localização: /expedicao</Badge>
                    
                    <div className="ml-4 space-y-2">
                      <div>
                        <h4 className="font-medium">Faturamento (/expedicao/faturamento)</h4>
                        <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                          <li>• Cálculo de frete por peso/tonelada</li>
                          <li>• Rateio de valores entre notas fiscais</li>
                          <li>• Importação de lotes de notas</li>
                          <li>• Geração de documentos PDF</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">2.3 Outros Módulos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 border rounded">
                        <h4 className="font-medium">SAC (/sac)</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Gestão de ocorrências com timeline</li>
                          <li>• Sistema de chamados</li>
                          <li>• Dashboard de atendimentos</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 border rounded">
                        <h4 className="font-medium">Coletas (/coletas)</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Solicitações de coleta (FOB/CIF)</li>
                          <li>• Aprovações de coleta</li>
                          <li>• Alocação de cargas</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fluxo de Uso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitBranch className="w-5 h-5 mr-2" />
                  3. Fluxo de Uso Principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">3.1 Fluxo de Entrada (Recebimento)</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">1</Badge>
                        <span className="text-sm">Solicitação de Coleta: Cliente solicita coleta (FOB/CIF)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">2</Badge>
                        <span className="text-sm">Aprovação: Operador aprova a coleta</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">3</Badge>
                        <span className="text-sm">Execução da Coleta: Motorista realiza a coleta</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">4</Badge>
                        <span className="text-sm">Recebimento: Chegada no armazém → status "no_armazem"</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">5</Badge>
                        <span className="text-sm">Geração de Etiquetas: Criação de etiquetas individuais e etiquetas-mãe</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">6</Badge>
                        <span className="text-sm">Enderecamento: Definição de localização no armazém</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">3.2 Fluxo de Expedição</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">1</Badge>
                        <span className="text-sm">Criação de OC: Ordem de carregamento para cliente específico</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">2</Badge>
                        <span className="text-sm">Seleção de Notas: Importação de notas fiscais para a OC</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">3</Badge>
                        <span className="text-sm">Conferência: Verificação de volumes e etiquetas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">4</Badge>
                        <span className="text-sm">Carregamento: Posicionamento no veículo</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">5</Badge>
                        <span className="text-sm">Faturamento: Cálculo e rateio de frete</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">6</Badge>
                        <span className="text-sm">Emissão de Documentos: CTe, DANFE, documentos auxiliares</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">7</Badge>
                        <span className="text-sm">Expedição: Saída do veículo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estrutura de Dados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  4. Estrutura de Dados (Tabelas Principais)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">4.1 Tabelas Core</h3>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm space-y-2">
                      <div>
                        <strong>empresas:</strong> id, razao_social, cnpj, tipo, endereco, status
                      </div>
                      <div>
                        <strong>notas_fiscais:</strong> id, numero, chave_acesso, valor_total, peso_bruto, remetente_id, destinatario_id, status
                      </div>
                      <div>
                        <strong>etiquetas:</strong> id, codigo, nota_fiscal_id, tipo, volume_numero, total_volumes, status
                      </div>
                      <div>
                        <strong>ordens_carregamento:</strong> id, numero_ordem, tipo_carregamento, empresa_cliente_id, status
                      </div>
                      <div>
                        <strong>coletas:</strong> id, numero_coleta, empresa_cliente_id, endereco_coleta, data_programada, status
                      </div>
                      <div>
                        <strong>ocorrencias:</strong> id, tipo, descricao, status, prioridade, nota_fiscal_id, usuario_reportou_id
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">4.2 Relacionamentos Principais</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• <code>notas_fiscais</code> → <code>empresas</code> (remetente/destinatário)</li>
                      <li>• <code>etiquetas</code> → <code>notas_fiscais</code></li>
                      <li>• <code>itens_carregamento</code> → <code>ordens_carregamento</code> + <code>notas_fiscais</code></li>
                      <li>• <code>ocorrencias</code> → <code>notas_fiscais</code>, <code>coletas</code>, <code>ordens_carregamento</code></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissões */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  5. Permissões e Perfis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">5.1 Estrutura de Permissões</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Modelo hierárquico:</strong> Módulo → Tabela → Rotina
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 border rounded">
                        <Badge variant="destructive" className="mb-2">admin</Badge>
                        <p className="text-xs text-muted-foreground">Acesso total ao sistema</p>
                      </div>
                      <div className="p-3 border rounded">
                        <Badge variant="secondary" className="mb-2">operador</Badge>
                        <p className="text-xs text-muted-foreground">Operações básicas de armazenagem</p>
                      </div>
                      <div className="p-3 border rounded">
                        <Badge variant="outline" className="mb-2">comercial</Badge>
                        <p className="text-xs text-muted-foreground">Faturamento e expedição</p>
                      </div>
                      <div className="p-3 border rounded">
                        <Badge variant="outline" className="mb-2">atendimento</Badge>
                        <p className="text-xs text-muted-foreground">SAC e ocorrências</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">5.2 Validações por Empresa</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Usuários vinculados a empresas específicas</li>
                      <li>• Visualização de dados filtrada por empresa</li>
                      <li>• RLS (Row Level Security) no Supabase</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tecnologias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  6. Tecnologias e Integrações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">6.1 Stack Tecnológico</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Badge variant="outline">React</Badge>
                      <Badge variant="outline">TypeScript</Badge>
                      <Badge variant="outline">Vite</Badge>
                      <Badge variant="outline">Tailwind CSS</Badge>
                      <Badge variant="outline">Shadcn/ui</Badge>
                      <Badge variant="outline">Supabase</Badge>
                      <Badge variant="outline">PostgreSQL</Badge>
                      <Badge variant="outline">React Query</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">6.2 Integrações Externas</h3>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>XML de Notas Fiscais:</strong> Parser para importação automática</li>
                      <li>• <strong>APIs de CEP:</strong> Consulta de endereços</li>
                      <li>• <strong>Impressão:</strong> Geração de etiquetas em vários formatos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  7. Limitações e Considerações para Migração
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">7.1 Limitações Atuais</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Sem integração ERP nativa</li>
                      <li>• Autenticação bypassed para desenvolvimento</li>
                      <li>• Dados mockados em algumas funcionalidades</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">7.2 Customizações Implementadas</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Sistema de etiquetas com múltiplos layouts</li>
                      <li>• Filtros avançados por status e datas</li>
                      <li>• Visualizações Kanban personalizadas</li>
                      <li>• Cálculos de frete configuráveis</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">7.3 Pontos de Atenção para Migração</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm"><strong>Crítico:</strong> Migração de dados do Supabase PostgreSQL</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm"><strong>Importante:</strong> Replicação das regras de negócio de cálculo de frete</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm"><strong>Importante:</strong> Manutenção da estrutura de permissões hierárquica</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm"><strong>Importante:</strong> Preservação dos workflows de status das notas fiscais</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navegação do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitBranch className="w-5 h-5 mr-2" />
                  8. Estrutura de Navegação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm">
                  <div>Dashboard</div>
                  <div>├── Armazenagem</div>
                  <div>│   ├── Recebimento</div>
                  <div>│   ├── Movimentações</div>
                  <div>│   └── Carregamento</div>
                  <div>├── Expedição</div>
                  <div>│   ├── Faturamento</div>
                  <div>│   ├── Documentos</div>
                  <div>│   └── Remessas</div>
                  <div>├── SAC</div>
                  <div>│   ├── Ocorrências</div>
                  <div>│   ├── Atendimentos</div>
                  <div>│   └── Chamados</div>
                  <div>├── Coletas</div>
                  <div>│   ├── Solicitações</div>
                  <div>│   ├── Aprovações</div>
                  <div>│   └── Cargas</div>
                  <div>└── Cadastros</div>
                  <div>    ├── Empresas</div>
                  <div>    ├── Usuários</div>
                  <div>    └── Configurações</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  );
};

export default DocumentacaoSistema;
