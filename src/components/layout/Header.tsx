import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  User,
  ChevronDown,
  Truck,
  Box,
  Boxes,
  ClipboardList,
  Users,
  FileText,
  Settings,
  BarChart,
  Warehouse
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const navigationItems = [
    {
      id: 'armazenagem',
      label: 'Armazenagem',
      items: [
        { label: 'Visão Geral', icon: <Warehouse className="w-4 h-4" />, path: '/armazenagem' },
        { label: 'Recebimento', icon: <Box className="w-4 h-4" />, path: '/armazenagem/recebimento' },
        { label: 'Movimentações', icon: <Truck className="w-4 h-4" />, path: '/armazenagem/movimentacoes' },
        { label: 'Carregamento', icon: <Boxes className="w-4 h-4" />, path: '/armazenagem/carregamento' }
      ]
    },
    {
      id: 'coletas',
      label: 'Coletas',
      items: [
        { label: 'Visão Geral', icon: <Truck className="w-4 h-4" />, path: '/coletas' },
        { label: 'Agendamentos', icon: <ClipboardList className="w-4 h-4" />, path: '/coletas/agendamentos' }
      ]
    },
    {
      id: 'expedicao',
      label: 'Expedição',
      items: [
        { label: 'Visão Geral', icon: <Truck className="w-4 h-4" />, path: '/expedicao' },
        { label: 'Ordens', icon: <ClipboardList className="w-4 h-4" />, path: '/expedicao/ordens' }
      ]
    },
    {
      id: 'cadastros',
      label: 'Cadastros',
      items: [
        { label: 'Clientes', icon: <Users className="w-4 h-4" />, path: '/cadastros/clientes' },
        { label: 'Fornecedores', icon: <Users className="w-4 h-4" />, path: '/cadastros/fornecedores' },
        { label: 'Produtos', icon: <Box className="w-4 h-4" />, path: '/cadastros/produtos' }
      ]
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      items: [
        { label: 'Operacional', icon: <BarChart className="w-4 h-4" />, path: '/relatorios/operacional' },
        { label: 'Financeiro', icon: <FileText className="w-4 h-4" />, path: '/relatorios/financeiro' }
      ]
    }
  ];

  return (
    <div className="bg-white shadow">
      {/* Top bar with logo and user info */}
      <div className="h-14 bg-[#0098DA] px-4">
        <div className="container mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-white">
              CROSS WMS
            </Link>

            {/* Search */}
            <div className="hidden lg:block relative w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="search"
                placeholder="Buscar em todo o sistema..."
                className="w-full pl-10 pr-4 py-1.5 text-sm border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/70 focus:ring-white/30 focus:border-white/30"
              />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-white/80 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/20">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">Administrador</span>
                <span className="text-xs text-white/70">leonardo@email.com</span>
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="h-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 h-full">
          <ul className="flex h-full -mb-px">
            {navigationItems.map((item) => (
              <li
                key={item.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  className={`h-full px-4 flex items-center gap-1 text-sm font-medium
                    ${location.pathname.startsWith(`/${item.id}`) || activeDropdown === item.id
                      ? 'text-[#0098DA] border-b-2 border-[#0098DA]' 
                      : 'text-[#2D363F] hover:text-[#0098DA]'
                    }`}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {activeDropdown === item.id && (
                  <div className="absolute top-full left-0 w-72 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.path}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#2D363F] hover:bg-[#0098DA]/5 hover:text-[#0098DA]"
                      >
                        {subItem.icon}
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile search - only shown on small screens */}
      <div className="lg:hidden p-3 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Buscar em todo o sistema..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-[#0098DA] focus:border-[#0098DA]"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
