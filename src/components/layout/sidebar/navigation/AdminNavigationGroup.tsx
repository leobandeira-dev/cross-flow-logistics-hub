
import React from 'react';
import { 
  Briefcase, LayoutDashboard, Users, FileSpreadsheet, 
  CreditCard, FileText, Package, BookUser, HelpCircle, Target 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SubMenu from '../SubMenu';
import SidebarItem from '../SidebarItem';

const AdminNavigationGroup: React.FC = () => {
  const { user } = useAuth();
  
  // Only render for admin users
  if (!user || user.funcao !== 'admin') {
    return null;
  }

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

export default AdminNavigationGroup;
