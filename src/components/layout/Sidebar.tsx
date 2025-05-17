
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Truck, PackageOpen, LayoutDashboard, MessageSquare, FileText, 
  Users, Settings, ChevronDown, LogOut, Package, Archive, Box, Map, Building, MapPin,
  Calculator, BarChart, PieChart, Table, Download, Printer, Search, Filter
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active }) => {
  return (
    <Link 
      to={href} 
      className={`flex items-center gap-3 py-3 px-4 rounded-md transition-colors
        ${active 
          ? 'bg-sidebar-accent text-sidebar-foreground' 
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'
        }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

interface SubMenuProps {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SubMenu: React.FC<SubMenuProps> = ({ label, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  return (
    <div className="my-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sidebar-foreground/70 hover:text-sidebar-foreground px-4 py-3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} />
          <span>{label}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="pl-10 pr-4 py-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect will be handled automatically by the AuthContext
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <aside className="w-64 bg-sidebar h-screen flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-cross-blue rounded flex items-center justify-center text-white font-heading text-xl">
            CX
          </div>
          <span className="ml-3 text-white font-heading text-xl">CROSS</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active />
        
        <SubMenu icon={Truck} label="Coletas" defaultOpen={false}>
          <SidebarItem icon={FileText} label="Solicitações" href="/coletas/solicitacoes" />
          <SidebarItem icon={FileText} label="Aprovações" href="/coletas/aprovacoes" />
          <SidebarItem icon={Map} label="Alocação de Cargas" href="/coletas/alocacao" />
        </SubMenu>
        
        {/* Armazenagem (Storage) Module */}
        <SubMenu icon={Archive} label="Armazenagem" defaultOpen={false}>
          {/* Recebimento (Receiving) */}
          <SubMenu icon={Package} label="Recebimento" defaultOpen={false}>
            <SidebarItem icon={Package} label="Visão Geral" href="/armazenagem" />
            <SidebarItem icon={Box} label="Fornecedor" href="/armazenagem/recebimento/fornecedor" />
            <SidebarItem icon={Box} label="Coleta" href="/armazenagem/recebimento/coleta" />
            <SidebarItem icon={Box} label="Entre Filiais" href="/armazenagem/recebimento/filiais" />
            <SidebarItem icon={FileText} label="Notas Fiscais" href="/armazenagem/recebimento/notas" />
            <SidebarItem icon={FileText} label="Etiquetas" href="/armazenagem/recebimento/etiquetas" />
          </SubMenu>
          
          {/* Movimentações (Internal Movements) */}
          <SubMenu icon={Package} label="Movimentações" defaultOpen={false}>
            <SidebarItem icon={Box} label="Visão Geral" href="/armazenagem/movimentacoes" />
            <SidebarItem icon={Box} label="Unitização" href="/armazenagem/movimentacoes/unitizacao" />
            <SidebarItem icon={Box} label="Cancelar Unit." href="/armazenagem/movimentacoes/cancelar-unitizacao" />
            <SidebarItem icon={Box} label="Endereçamento" href="/armazenagem/movimentacoes/enderecamento" />
          </SubMenu>
          
          {/* Carregamento (Loading) */}
          <SubMenu icon={Truck} label="Carregamento" defaultOpen={false}>
            <SidebarItem icon={Truck} label="Visão Geral" href="/armazenagem/carregamento" />
            <SidebarItem icon={FileText} label="Ordem" href="/armazenagem/carregamento/ordem" />
            <SidebarItem icon={FileText} label="Conferência" href="/armazenagem/carregamento/conferencia" />
            <SidebarItem icon={Box} label="Endereçamento" href="/armazenagem/carregamento/enderecamento" />
            <SidebarItem icon={FileText} label="Checklist" href="/armazenagem/carregamento/checklist" />
          </SubMenu>
        </SubMenu>
        
        <SubMenu icon={Users} label="Motoristas" defaultOpen={false}>
          <SidebarItem icon={Users} label="Cadastro" href="/motoristas/cadastro" />
          <SidebarItem icon={PackageOpen} label="Cargas" href="/motoristas/cargas" />
        </SubMenu>
        
        {/* Menu de Cadastros */}
        <SubMenu icon={FileText} label="Cadastros" defaultOpen={false}>
          <SubMenu icon={Users} label="Usuários" defaultOpen={false}>
            <SidebarItem icon={Users} label="Cadastro" href="/usuarios/cadastro" />
            <SidebarItem icon={Settings} label="Permissões" href="/usuarios/permissoes" />
          </SubMenu>
          <SubMenu icon={Building} label="Empresas" defaultOpen={false}>
            <SidebarItem icon={Building} label="Cadastro" href="/empresas/cadastro" />
            <SidebarItem icon={Settings} label="Permissões" href="/empresas/permissoes" />
          </SubMenu>
          <SubMenu icon={MapPin} label="Endereçamento" defaultOpen={false}>
            <SidebarItem icon={MapPin} label="Cadastro" href="/cadastros/enderecamento" />
          </SubMenu>
        </SubMenu>
        
        <SidebarItem icon={MessageSquare} label="SAC" href="/sac" />
        
        {/* Expedição submenu */}
        <SubMenu icon={FileText} label="Expedição" defaultOpen={false}>
          <SidebarItem icon={FileText} label="Documentos" href="/expedicao" />
          <SidebarItem icon={Calculator} label="Faturamento" href="/expedicao/faturamento" />
        </SubMenu>
        
        {/* Novo menu de Relatórios */}
        <SubMenu icon={BarChart} label="Relatórios" defaultOpen={false}>
          <SidebarItem icon={BarChart} label="Visão Geral" href="/relatorios" />
          <SubMenu icon={Truck} label="Coletas" defaultOpen={false}>
            <SidebarItem icon={BarChart} label="Solicitações" href="/relatorios/coletas/solicitacoes" />
            <SidebarItem icon={PieChart} label="Aprovações" href="/relatorios/coletas/aprovacoes" />
          </SubMenu>
          <SubMenu icon={Archive} label="Armazenagem" defaultOpen={false}>
            <SidebarItem icon={Table} label="Volumes" href="/relatorios/armazenagem/volumes" />
            <SidebarItem icon={BarChart} label="Movimentações" href="/relatorios/armazenagem/movimentacoes" />
          </SubMenu>
          <SidebarItem icon={Truck} label="Carregamento" href="/relatorios/carregamento/ordens" />
          <SidebarItem icon={Calculator} label="Faturamento" href="/relatorios/expedicao/faturamento" />
          <SidebarItem icon={Users} label="Motoristas" href="/relatorios/motoristas/performance" />
          <SidebarItem icon={MessageSquare} label="Ocorrências" href="/relatorios/sac/ocorrencias" />
        </SubMenu>
      </nav>
      
      <div className="border-t border-sidebar-border p-4">
        <SidebarItem icon={Settings} label="Configurações" href="/configuracoes" />
        <button 
          className="flex items-center gap-3 py-3 px-4 text-sidebar-foreground/70 hover:text-sidebar-foreground w-full rounded-md transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
