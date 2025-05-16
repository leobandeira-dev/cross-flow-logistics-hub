
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, Truck, Package, ClipboardList, BarChart4, Users } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-primary">LogSystem</span>
            </div>
            <div className="flex items-center">
              {user ? (
                <Button asChild>
                  <Link to="/dashboard">
                    Acessar Sistema <LogIn className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/auth">
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
                  <Link to="/auth">Começar agora</Link>
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="flex justify-center items-center h-full">
                <div className="bg-gray-100 p-8 rounded-xl shadow-lg">
                  <img
                    className="w-full object-cover"
                    src="/placeholder.svg"
                    alt="Dashboard illustration"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
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
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="p-3 inline-flex items-center justify-center rounded-md bg-primary-100">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">Gerenciamento de Armazenagem</h3>
                <p className="mt-2 text-base text-gray-500">
                  Controle total do estoque, movimentação interna e organização do armazém.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="p-3 inline-flex items-center justify-center rounded-md bg-primary-100">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">Controle de Carregamento</h3>
                <p className="mt-2 text-base text-gray-500">
                  Planejamento e execução de carregamentos com rastreabilidade total.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="p-3 inline-flex items-center justify-center rounded-md bg-primary-100">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">Gestão de Coletas</h3>
                <p className="mt-2 text-base text-gray-500">
                  Controle de solicitações de coleta e alocação de cargas e motoristas.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="p-3 inline-flex items-center justify-center rounded-md bg-primary-100">
                  <BarChart4 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">Relatórios Gerenciais</h3>
                <p className="mt-2 text-base text-gray-500">
                  Insights e análises para tomada de decisão estratégica.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="p-3 inline-flex items-center justify-center rounded-md bg-primary-100">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">Cadastros Completos</h3>
                <p className="mt-2 text-base text-gray-500">
                  Gerenciamento completo de empresas, usuários, motoristas e veículos.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="p-3 inline-flex items-center justify-center rounded-md bg-primary-100">
                  <LogIn className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">Acesso Seguro</h3>
                <p className="mt-2 text-base text-gray-500">
                  Controle de permissões por perfil de usuário com segurança avançada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Pronto para começar?</span>
            <span className="block text-white opacity-75">Acesse agora mesmo e transforme sua logística.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/auth">
                  Criar uma conta
                </Link>
              </Button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Button variant="outline" size="lg" className="bg-white hover:bg-gray-50" asChild>
                <Link to="/auth">
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} LogSystem. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
