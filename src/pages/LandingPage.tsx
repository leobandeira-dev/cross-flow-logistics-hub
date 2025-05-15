
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart, Shield, TrendingUp, Truck, Package, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/placeholder.svg" alt="CROSS Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-2xl font-heading text-cross-gray">CROSS</h1>
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li><a href="#solucoes" className="text-cross-gray hover:text-cross-blue transition-colors">Soluções</a></li>
              <li><a href="#beneficios" className="text-cross-gray hover:text-cross-blue transition-colors">Benefícios</a></li>
              <li><a href="#destaques" className="text-cross-gray hover:text-cross-blue transition-colors">Destaques</a></li>
              <li><a href="#comparativo" className="text-cross-gray hover:text-cross-blue transition-colors">Comparativo</a></li>
              <li><Link to="/auth" className="text-cross-blue hover:text-cross-blueDark transition-colors font-medium">Entrar</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-heading text-cross-gray mb-6 leading-tight">
                Gerencie sua operação logística com <span className="text-cross-blue">precisão e eficiência</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Acabe com os atrasos, extravios e erros operacionais. Obtenha controle total sobre suas operações de armazenagem e distribuição.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-cross-blue hover:bg-cross-blueDark">
                  Agendar demonstração <ArrowRight className="ml-2" />
                </Button>
                <Link to="/auth?register=true">
                  <Button size="lg" variant="outline" className="border-cross-blue text-cross-blue hover:bg-cross-blue hover:text-white">
                    Criar conta gratuita
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img alt="Dashboard do CROSS" className="rounded-lg shadow-xl w-full max-w-md" src="/placeholder.svg" />
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section id="solucoes" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading text-center mb-16">
            Problemas que <span className="text-cross-blue">resolvemos</span> para você
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 hover:shadow-md transition-all">
              <div className="bg-cross-blue rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Clock className="text-white" />
              </div>
              <h3 className="text-xl font-heading mb-4">Tempo perdido em processos manuais</h3>
              <p className="text-gray-600">
                Planilhas e controles manuais aumentam o tempo de processamento e geram erros. Reduza até 70% no tempo operacional com automatização inteligente.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 hover:shadow-md transition-all">
              <div className="bg-cross-blue rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Package className="text-white" />
              </div>
              <h3 className="text-xl font-heading mb-4">Erros de separação de carga</h3>
              <p className="text-gray-600">
                Ocorrências de separação incorreta causam prejuízos e insatisfação. Nossa solução elimina até 95% dos erros de separação com conferência validada.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 hover:shadow-md transition-all">
              <div className="bg-cross-blue rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <BarChart className="text-white" />
              </div>
              <h3 className="text-xl font-heading mb-4">Falta de visibilidade em tempo real</h3>
              <p className="text-gray-600">
                Decisões tomadas sem dados atualizados geram ineficiência. Acesse KPIs em tempo real para antecipar problemas e otimizar recursos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="beneficios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading text-center mb-16">
            Benefícios da <span className="text-cross-blue">nossa plataforma</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex">
              <div className="mr-6 mt-1">
                <div className="bg-cross-blue rounded-full w-10 h-10 flex items-center justify-center">
                  <TrendingUp className="text-white h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-heading mb-3">Dashboards inteligentes</h3>
                <p className="text-gray-600 mb-2">
                  Visualize em tempo real os principais KPIs da sua operação logística:
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                  <li>Tempo médio de processamento</li>
                  <li>Taxa de ocorrências</li>
                  <li>Eficiência operacional por setor</li>
                  <li>Custos operacionais em tempo real</li>
                </ul>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-6 mt-1">
                <div className="bg-cross-blue rounded-full w-10 h-10 flex items-center justify-center">
                  <Truck className="text-white h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-heading mb-3">Gestão integrada de coletas</h3>
                <p className="text-gray-600 mb-2">
                  Sistema completo e automatizado que elimina erros e atrasos:
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                  <li>Solicitação digital com aprovação</li>
                  <li>Alocação inteligente de recursos</li>
                  <li>Rastreamento em tempo real</li>
                  <li>Avaliação de desempenho automática</li>
                </ul>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-6 mt-1">
                <div className="bg-cross-blue rounded-full w-10 h-10 flex items-center justify-center">
                  <Package className="text-white h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-heading mb-3">Armazenagem eficiente</h3>
                <p className="text-gray-600 mb-2">
                  Maximize o uso do seu espaço com tecnologia avançada:
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                  <li>Endereçamento inteligente</li>
                  <li>Unitização de paletes otimizada</li>
                  <li>Separação guiada por sistema</li>
                  <li>Gestão FIFO/FEFO automatizada</li>
                </ul>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-6 mt-1">
                <div className="bg-cross-blue rounded-full w-10 h-10 flex items-center justify-center">
                  <Shield className="text-white h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-heading mb-3">Controle de acessos seguro</h3>
                <p className="text-gray-600 mb-2">
                  Garanta que apenas pessoas autorizadas acessem informações sensíveis:
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                  <li>Perfis de acesso personalizados</li>
                  <li>Autenticação segura em dois fatores</li>
                  <li>Auditoria completa de atividades</li>
                  <li>Gestão centralizada de permissões</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results/KPIs Section */}
      <section id="destaques" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading text-center mb-16">
            Resultados <span className="text-cross-blue">comprovados</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-4xl font-heading text-cross-blue mb-2">85%</p>
              <p className="text-gray-600">Redução de erros operacionais</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-4xl font-heading text-cross-blue mb-2">68%</p>
              <p className="text-gray-600">Aumento de produtividade</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-4xl font-heading text-cross-blue mb-2">45%</p>
              <p className="text-gray-600">Redução de custos operacionais</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-4xl font-heading text-cross-blue mb-2">3.8x</p>
              <p className="text-gray-600">Retorno sobre investimento</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 border border-gray-100 rounded-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                <img src="/placeholder.svg" alt="Cliente satisfeito" className="rounded-full w-32 h-32 object-cover" />
              </div>
              <div className="md:w-3/4 md:pl-8">
                <p className="text-gray-600 italic mb-4">
                  "Depois de implementar o sistema CROSS, conseguimos reduzir nosso tempo de processamento de pedidos em 70%. Os dashboards de performance nos permitem identificar gargalos operacionais em tempo real e tomar decisões baseadas em dados. O retorno sobre o investimento foi alcançado em menos de 6 meses."
                </p>
                <p className="font-medium">Carlos Silva</p>
                <p className="text-gray-500 text-sm">Diretor de Operações, Logística Express</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section id="comparativo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading text-center mb-6">
            Comparativo de <span className="text-cross-blue">Módulos e Funcionalidades</span>
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Conheça os módulos disponíveis e escolha o plano que melhor atende às necessidades do seu negócio
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cross-blue text-white">
                  <th className="border border-gray-200 px-4 py-3 text-left min-w-[200px]">Funcionalidades</th>
                  <th className="border border-gray-200 px-4 py-3 text-center">Básico</th>
                  <th className="border border-gray-200 px-4 py-3 text-center">Intermediário</th>
                  <th className="border border-gray-200 px-4 py-3 text-center">Completo</th>
                  <th className="border border-gray-200 px-4 py-3 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100 font-medium">
                  <td colSpan={5} className="border border-gray-200 px-4 py-2 bg-gray-200">Módulo: Coletas</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Solicitação de Coletas</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Aprovações de Coletas</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Alocação de Cargas</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Importação de Lotes</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                
                <tr className="bg-gray-100 font-medium">
                  <td colSpan={5} className="border border-gray-200 px-4 py-2 bg-gray-200">Módulo: Armazenagem</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Recebimento Básico</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Endereçamento</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Unitização Paletes</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Movimentações Internas</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                
                <tr className="bg-gray-100 font-medium">
                  <td colSpan={5} className="border border-gray-200 px-4 py-2 bg-gray-200">Módulo: Carregamento</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Ordem de Carregamento</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Endereçamento de Caminhão</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                
                <tr className="bg-gray-100 font-medium">
                  <td colSpan={5} className="border border-gray-200 px-4 py-2 bg-gray-200">Módulo: Relatórios</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Relatórios Básicos</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Dashboards</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Exportação (PDF/Excel)</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">BI / Analytics</td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"></td>
                  <td className="border border-gray-200 px-4 py-2 text-center"><Check className="mx-auto h-5 w-5 text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/auth?register=true">
              <Button size="lg" className="bg-cross-blue hover:bg-cross-blueDark">
                Começar gratuitamente
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cross-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading mb-6">Pronto para transformar sua operação logística?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já otimizaram seus processos com nossa plataforma.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-cross-blue hover:bg-gray-100">
              Agendar demonstração
            </Button>
            <Link to="/auth?register=true">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cross-blue">
                Criar conta gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-heading text-white text-lg mb-4">CROSS</h3>
              <p className="mb-4">Sistema completo para gestão de operações logísticas e armazenagem.</p>
            </div>
            <div>
              <h4 className="font-heading text-white text-lg mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-cross-blue transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-cross-blue transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-cross-blue transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-cross-blue transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-white text-lg mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-cross-blue transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-cross-blue transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-cross-blue transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-cross-blue transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-white text-lg mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-cross-blue transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-cross-blue transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-cross-blue transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-cross-blue transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} CROSS Sistemas de Logística. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>;
};

export default LandingPage;
