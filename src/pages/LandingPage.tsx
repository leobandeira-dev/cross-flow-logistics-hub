import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, Truck, Package, ClipboardList, BarChart4, Users, ShieldCheck, Warehouse, FileCheck, Headphones, BadgeCheck, Headset } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LandingPage = () => {
  console.log('LandingPage component is rendering');
  
  const { user } = useAuth();

  // Define the sales packages
  const salesPackages = [{
    name: "Básico",
    price: "R$ 599/mês",
    description: "Para pequenas operações logísticas",
    features: ["Gestão de Coletas", "Cadastros Básicos", "Relatórios Essenciais", "1 Usuário"],
    highlighted: false
  }, {
    name: "Profissional",
    price: "R$ 1.299/mês",
    description: "Para operações em crescimento",
    features: ["Tudo do Básico", "Armazenagem Completa", "Carregamento", "SAC", "5 Usuários"],
    highlighted: true
  }, {
    name: "Empresarial",
    price: "R$ 2.499/mês",
    description: "Para operações complexas",
    features: ["Tudo do Profissional", "Expedição Completa", "Faturamento Automático", "API de Integração", "Usuários Ilimitados"],
    highlighted: false
  }];

  // Define the module features
  const moduleFeatures = [{
    title: "Gestão de Armazenagem",
    description: "Controle completo do estoque, movimentação interna e rastreamento de volumes",
    icon: Warehouse,
    features: ["Recebimento de Fornecedores", "Movimentações Internas", "Endereçamento Inteligente", "Unitização de Paletes"]
  }, {
    title: "Controle de Carregamento",
    description: "Planejamento e execução de carregamentos com rastreabilidade total",
    icon: Truck,
    features: ["Ordens de Carregamento", "Conferência de Carga", "Checklist de Veículos", "Endereçamento em Caminhão"]
  }, {
    title: "Gestão de Coletas",
    description: "Controle de solicitações de coleta e alocação de cargas e motoristas",
    icon: ClipboardList,
    features: ["Solicitações de Coleta", "Aprovações e Workflow", "Alocação de Cargas", "Roteirização Inteligente"]
  }, {
    title: "Expedição e Faturamento",
    description: "Emissão de documentos e gestão de faturamento integrado",
    icon: FileCheck,
    features: ["Emissão de Documentos", "Faturamento Automático", "Controle de Remessas", "Gestão de Notas Fiscais"]
  }, {
    title: "Relatórios Gerenciais",
    description: "Insights e análises para tomada de decisão estratégica",
    icon: BarChart4,
    features: ["Dashboards Personalizados", "Performance de Motoristas", "Volume por Período", "Análise de Ocorrências"]
  }, {
    title: "Suporte ao Cliente",
    description: "Gestão completa de ocorrências e atendimentos",
    icon: Headset,
    features: ["Registro de Ocorrências", "Tratamento de Chamados", "Notificações Automáticas", "Histórico de Atendimentos"]
  }];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-primary">LogSystem</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-4">
                <Link to="#features" className="text-gray-600 hover:text-primary">Funcionalidades</Link>
                <Link to="#modules" className="text-gray-600 hover:text-primary">Módulos</Link>
                <Link to="#pricing" className="text-gray-600 hover:text-primary">Planos</Link>
              </div>
              {user ? (
                <Button asChild>
                  <Link to="/dashboard">
                    Acessar Sistema <LogIn className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/auth/login">
                    Login / Cadastro <LogIn className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Gestão Logística</span>
                <span className="block text-primary">Eficiente e Inteligente</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Uma plataforma completa para gerenciar todas as operações logísticas de sua empresa, desde o recebimento de mercadorias até a entrega ao cliente final.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Button size="lg" asChild className="px-10">
                  <Link to="/auth/login">Começar agora</Link>
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="flex justify-center items-center h-full">
                <div className="bg-gray-100 p-8 rounded-xl shadow-lg">
                  <img className="w-full object-cover rounded-lg" alt="Dashboard illustration" src="/lovable-uploads/2720fc5f-47f0-48b5-9b76-972ae900cd75.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Principais Benefícios
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Simplifique sua operação logística e ganhe eficiência com nossa plataforma
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Rastreabilidade Total</h3>
              <p className="mt-2 text-gray-500">Acompanhe seus produtos em tempo real desde o recebimento até a entrega</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-green-100 rounded-full">
                <BadgeCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Processos Otimizados</h3>
              <p className="mt-2 text-gray-500">Reduza erros operacionais e aumente a produtividade com workflows inteligentes</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart4 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Insights em Tempo Real</h3>
              <p className="mt-2 text-gray-500">Tenha acesso a relatórios e dashboards para tomada de decisões estratégicas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Funcionalidades</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tudo o que você precisa para gerenciar sua logística
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Uma solução completa que integra todos os processos logísticos em uma única plataforma.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {moduleFeatures.map(feature => (
                <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="p-3 inline-flex items-center justify-center rounded-md bg-primary-100">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {feature.features.map((item, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-500">
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Planos e Preços
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Escolha o plano ideal para o seu negócio
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {salesPackages.map((pkg) => (
              <Card key={pkg.name} className={`relative ${pkg.highlighted ? 'border-primary shadow-lg' : ''}`}>
                {pkg.highlighted && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <BadgeCheck className="h-5 w-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={pkg.highlighted ? 'default' : 'outline'}>
                    Começar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">&copy; 2024 Cross Flow Logistics. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;