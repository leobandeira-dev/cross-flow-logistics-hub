
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, PackageOpen, BarChart3, LayoutDashboard, MessageSquare, FileText, 
  Users, Settings, ChevronDown, LogOut, Package, Archive, Box, Map
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
        <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/" active />
        
        <SubMenu icon={Truck} label="Coletas" defaultOpen={true}>
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
        
        <SidebarItem icon={BarChart3} label="Dashboards" href="/dashboards" />
        <SidebarItem icon={MessageSquare} label="SAC" href="/sac" />
        <SidebarItem icon={FileText} label="Expedição" href="/expedicao" />
      </nav>
      
      <div className="border-t border-sidebar-border p-4">
        <SidebarItem icon={Settings} label="Configurações" href="/configuracoes" />
        <button className="flex items-center gap-3 py-3 px-4 text-sidebar-foreground/70 hover:text-sidebar-foreground w-full rounded-md transition-colors">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
