
import React from 'react';
import { BarChart, Truck, PieChart, Table, Calculator, Users, MessageSquare, Archive } from 'lucide-react';

import SubMenu from '../SubMenu';
import SidebarItem from '../SidebarItem';

const RelatoriosNavigationGroup: React.FC = () => {
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

export default RelatoriosNavigationGroup;
