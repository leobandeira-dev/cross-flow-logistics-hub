
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Truck, PackageOpen, LayoutDashboard, MessageSquare, FileText, 
  Users, Settings, ChevronDown, LogOut, Package, Archive, Box, Map, Building, MapPin,
  Calculator, BarChart, PieChart, Table, Download, Printer, Search, Filter, List, Kanban,
  ClipboardList, CreditCard, FileSpreadsheet, Briefcase, BookUser, HelpCircle, Target,
  Bell, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: React.ReactNode;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, href, children, active }) => {
  const location = useLocation();
  const isActive = active || (href && location.pathname === href);

  if (children) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`flex items-center gap-2 px-4 py-2 h-10 text-white hover:bg-white/10 transition-colors ${
              isActive ? 'bg-white/20' : ''
            }`}
          >
            <Icon size={18} />
            <span className="hidden md:inline">{label}</span>
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white border shadow-lg">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link to={href || '#'}>
      <Button
        variant="ghost"
        className={`flex items-center gap-2 px-4 py-2 h-10 text-white hover:bg-white/10 transition-colors ${
          isActive ? 'bg-white/20' : ''
        }`}
      >
        <Icon size={18} />
        <span className="hidden md:inline">{label}</span>
      </Button>
    </Link>
  );
};

const TopNavbar: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Simple navigation to dashboard since there's no authentication
    navigate('/dashboard');
  };

  return (
    <nav className="bg-sidebar border-b border-sidebar-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-cross-blue rounded flex items-center justify-center text-white font-heading text-sm mr-3">
            CX
          </div>
          <span className="text-white font-heading text-lg hidden sm:inline">CROSS</span>
        </div>

        {/* Navigation Menu */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          <NavItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          
          {/* Administração */}
          <NavItem icon={Briefcase} label="Administração">
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center gap-2">
                <LayoutDashboard size={16} />
                Dashboard Admin
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/clientes" className="flex items-center gap-2">
                <Users size={16} />
                Clientes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <FileSpreadsheet size={16} />
                Financeiro
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild>
                  <Link to="/admin/financeiro/recebimentos">
                    <CreditCard size={16} className="mr-2" />
                    Recebimentos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/financeiro/notas-fiscais">
                    <FileText size={16} className="mr-2" />
                    Notas Fiscais
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/suporte" className="flex items-center gap-2">
                <HelpCircle size={16} />
                Suporte
              </Link>
            </DropdownMenuItem>
          </NavItem>

          {/* Coletas */}
          <NavItem icon={Truck} label="Coletas">
            <DropdownMenuItem asChild>
              <Link to="/coletas/solicitacoes" className="flex items-center gap-2">
                <FileText size={16} />
                Solicitações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/coletas/aprovacoes" className="flex items-center gap-2">
                <FileText size={16} />
                Aprovações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/coletas/alocacao" className="flex items-center gap-2">
                <Map size={16} />
                Alocação de Cargas
              </Link>
            </DropdownMenuItem>
          </NavItem>

          {/* Armazenagem */}
          <NavItem icon={Archive} label="Armazenagem">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <Package size={16} />
                Recebimento
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild>
                  <Link to="/armazenagem">
                    <Package size={16} className="mr-2" />
                    Visão Geral
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/armazenagem/recebimento/fornecedor">
                    <Box size={16} className="mr-2" />
                    Fornecedor
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/armazenagem/recebimento/coleta">
                    <Box size={16} className="mr-2" />
                    Coleta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/armazenagem/recebimento/notas">
                    <FileText size={16} className="mr-2" />
                    Notas Fiscais
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/armazenagem/recebimento/etiquetas">
                    <FileText size={16} className="mr-2" />
                    Etiquetas
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <Package size={16} />
                Movimentações
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild>
                  <Link to="/armazenagem/movimentacoes">
                    <Box size={16} className="mr-2" />
                    Visão Geral
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/armazenagem/movimentacoes/unitizacao">
                    <Box size={16} className="mr-2" />
                    Unitização
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/armazenagem/movimentacoes/enderecamento">
                    <Box size={16} className="mr-2" />
                    Endereçamento
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem asChild>
              <Link to="/armazenagem/rastreamento" className="flex items-center gap-2">
                <Search size={16} />
                Rastreamento NF
              </Link>
            </DropdownMenuItem>
          </NavItem>

          {/* Cadastros */}
          <NavItem icon={FileText} label="Cadastros">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <Users size={16} />
                Usuários
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild>
                  <Link to="/usuarios/cadastro">
                    <Users size={16} className="mr-2" />
                    Cadastro
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/usuarios/permissoes">
                    <Settings size={16} className="mr-2" />
                    Permissões
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem asChild>
              <Link to="/cadastros/enderecamento" className="flex items-center gap-2">
                <MapPin size={16} />
                Endereçamento
              </Link>
            </DropdownMenuItem>
          </NavItem>

          {/* Relatórios */}
          <NavItem icon={BarChart} label="Relatórios">
            <DropdownMenuItem asChild>
              <Link to="/relatorios" className="flex items-center gap-2">
                <BarChart size={16} />
                Visão Geral
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/relatorios/armazenagem/volumes" className="flex items-center gap-2">
                <Table size={16} />
                Volumes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/relatorios/carregamento/ordens" className="flex items-center gap-2">
                <Truck size={16} />
                Carregamento
              </Link>
            </DropdownMenuItem>
          </NavItem>

          <NavItem icon={MessageSquare} label="SAC" href="/sac" />
        </div>

        {/* Right side - Search, Notifications, Profile */}
        <div className="flex items-center gap-2">
          <div className="relative hidden lg:block">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              type="search" 
              placeholder="Buscar..." 
              className="pl-8 w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Bell size={18} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <User size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/configuracoes" className="flex items-center gap-2">
                  <Settings size={16} />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                <LogOut size={16} />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
