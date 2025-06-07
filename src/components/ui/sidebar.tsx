import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Truck, 
  Box, 
  Boxes, 
  ClipboardList, 
  Users, 
  FileText, 
  Settings, 
  BarChart, 
  Warehouse,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      id: 'armazenagem',
      label: 'Armazenagem',
      icon: <Warehouse className="w-5 h-5" />,
      items: [
        { label: 'Visão Geral', path: '/armazenagem' },
        { label: 'Recebimento', path: '/armazenagem/recebimento' },
        { label: 'Movimentações', path: '/armazenagem/movimentacoes' },
        { label: 'Carregamento', path: '/armazenagem/carregamento' }
      ]
    },
    {
      id: 'coletas',
      label: 'Coletas',
      icon: <Truck className="w-5 h-5" />,
      items: [
        { label: 'Visão Geral', path: '/coletas' },
        { label: 'Agendamentos', path: '/coletas/agendamentos' }
      ]
    },
    {
      id: 'expedicao',
      label: 'Expedição',
      icon: <Box className="w-5 h-5" />,
      items: [
        { label: 'Visão Geral', path: '/expedicao' },
        { label: 'Ordens', path: '/expedicao/ordens' }
      ]
    },
    {
      id: 'cadastros',
      label: 'Cadastros',
      icon: <Users className="w-5 h-5" />,
      items: [
        { label: 'Clientes', path: '/cadastros/clientes' },
        { label: 'Fornecedores', path: '/cadastros/fornecedores' },
        { label: 'Produtos', path: '/cadastros/produtos' }
      ]
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: <FileText className="w-5 h-5" />,
      items: [
        { label: 'Operacional', path: '/relatorios/operacional' },
        { label: 'Financeiro', path: '/relatorios/financeiro' }
      ]
    }
  ];

  return (
    <div
      className={`
        h-screen bg-white border-r border-gray-200 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && <span className="text-lg font-semibold text-[#0098DA]">Menu</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <nav className="p-4">
        {navigationItems.map((item) => (
          <div key={item.id} className="mb-4">
            <div className="flex items-center mb-2">
              <div className="text-gray-500">{item.icon}</div>
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <div className="space-y-1 ml-8">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`
                      block px-3 py-2 text-sm rounded-lg transition-colors
                      ${location.pathname === subItem.path
                        ? 'bg-[#0098DA]/10 text-[#0098DA]'
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
