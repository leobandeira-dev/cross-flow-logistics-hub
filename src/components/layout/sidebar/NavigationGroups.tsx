
import React from 'react';
import { 
  Truck, PackageOpen, LayoutDashboard, MessageSquare, FileText, 
  Users, Building, MapPin, Map, Box, Package, Archive,
  Calculator, BarChart, PieChart, Table, ClipboardList, CreditCard, FileSpreadsheet, 
  Briefcase, BookUser, HelpCircle, Target
} from 'lucide-react';

import SubMenu from './SubMenu';
import SidebarItem from './SidebarItem';

export const AdminNavigationGroup: React.FC = () => {
  return (
    <SubMenu icon={Briefcase} label="Administração" defaultOpen={false}>
      <SidebarItem icon={LayoutDashboard} label="Dashboard Admin" href="/admin" />
      <SidebarItem icon={Users} label="Clientes" href="/admin/clientes" />
      <SubMenu icon={FileSpreadsheet} label="Financeiro" defaultOpen={false}>
        <SidebarItem icon={CreditCard} label="Recebimentos" href="/admin/financeiro/recebimentos" />
        <SidebarItem icon={FileText} label="Notas Fiscais" href="/admin/financeiro/notas-fiscais" />
      </SubMenu>
      <SubMenu icon={Package} label="Produtos" defaultOpen={false}>
        <SidebarItem icon={Package} label="Pacotes" href="/admin/produtos/pacotes" />
      </SubMenu>
      <SubMenu icon={BookUser} label="Acessos" defaultOpen={false}>
        <SidebarItem icon={Users} label="Gestão de Acessos" href="/admin/acessos" />
        <SidebarItem icon={FileText} label="Reset de Senhas" href="/admin/acessos/reset-senhas" />
      </SubMenu>
      <SidebarItem icon={HelpCircle} label="Suporte" href="/admin/suporte" />
      <SidebarItem icon={Target} label="Leads" href="/admin/leads" />
    </SubMenu>
  );
};

export const ColetasNavigationGroup: React.FC = () => {
  return (
    <SubMenu icon={Truck} label="Coletas" defaultOpen={false}>
      <SidebarItem icon={FileText} label="Solicitações" href="/coletas/solicitacoes" />
      <SidebarItem icon={FileText} label="Aprovações" href="/coletas/aprovacoes" />
      <SidebarItem icon={Map} label="Alocação de Cargas" href="/coletas/alocacao" />
    </SubMenu>
  );
};

export const ArmazenagemNavigationGroup: React.FC = () => {
  return (
    <SubMenu icon={Archive} label="Armazenagem" defaultOpen={false}>
      <SubMenu icon={Package} label="Recebimento" defaultOpen={false}>
        <SidebarItem icon={Package} label="Visão Geral" href="/armazenagem" />
        <SidebarItem icon={Box} label="Fornecedor" href="/armazenagem/recebimento/fornecedor" />
        <SidebarItem icon={Box} label="Coleta" href="/armazenagem/recebimento/coleta" />
        <SidebarItem icon={Box} label="Entre Filiais" href="/armazenagem/recebimento/filiais" />
        <SidebarItem icon={FileText} label="Notas Fiscais" href="/armazenagem/recebimento/notas" />
        <SidebarItem icon={FileText} label="Etiquetas" href="/armazenagem/recebimento/etiquetas" />
      </SubMenu>
      
      <SubMenu icon={Package} label="Movimentações" defaultOpen={false}>
        <SidebarItem icon={Box} label="Visão Geral" href="/armazenagem/movimentacoes" />
        <SidebarItem icon={Box} label="Unitização" href="/armazenagem/movimentacoes/unitizacao" />
        <SidebarItem icon={Box} label="Cancelar Unit." href="/armazenagem/movimentacoes/cancelar-unitizacao" />
        <SidebarItem icon={Box} label="Endereçamento" href="/armazenagem/movimentacoes/enderecamento" />
      </SubMenu>
      
      <SubMenu icon={Truck} label="Carregamento" defaultOpen={false}>
        <SidebarItem icon={Truck} label="Visão Geral" href="/armazenagem/carregamento" />
        <SidebarItem icon={FileText} label="Ordem" href="/armazenagem/carregamento/ordem" />
        <SidebarItem icon={FileText} label="Conferência" href="/armazenagem/carregamento/conferencia" />
        <SidebarItem icon={Box} label="Endereçamento" href="/armazenagem/carregamento/enderecamento" />
        <SidebarItem icon={FileText} label="Checklist" href="/armazenagem/carregamento/checklist" />
      </SubMenu>
      
      <SidebarItem icon={Search} label="Rastreamento NF" href="/armazenagem/rastreamento" />
    </SubMenu>
  );
};

export const MotoristasNavigationGroup: React.FC = () => {
  return (
    <SubMenu icon={Users} label="Motoristas" defaultOpen={false}>
      <SidebarItem icon={Users} label="Cadastro" href="/motoristas/cadastro" />
      <SidebarItem icon={PackageOpen} label="Cargas" href="/motoristas/cargas" />
    </SubMenu>
  );
};

export const CadastrosNavigationGroup: React.FC = () => {
  return (
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
  );
};

export const ExpedicaoNavigationGroup: React.FC = () => {
  return (
    <SubMenu icon={FileText} label="Expedição" defaultOpen={false}>
      <SidebarItem icon={FileText} label="Documentos" href="/expedicao/documentos" />
      <SidebarItem icon={Calculator} label="Faturamento" href="/expedicao/faturamento" />
      <SidebarItem icon={Truck} label="Remessas" href="/expedicao/remessas" />
    </SubMenu>
  );
};

export const RelatoriosNavigationGroup: React.FC = () => {
  return (
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
  );
};

// Missing import in the original component
import { Search, Settings } from 'lucide-react';

