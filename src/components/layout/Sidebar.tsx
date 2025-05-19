
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, MessageSquare, Settings } from 'lucide-react';

import SidebarItem from './sidebar/SidebarItem';
import LogoutButton from './sidebar/LogoutButton';
import { 
  AdminNavigationGroup, 
  ColetasNavigationGroup,
  ArmazenagemNavigationGroup, 
  MotoristasNavigationGroup,
  CadastrosNavigationGroup,
  ExpedicaoNavigationGroup,
  RelatoriosNavigationGroup
} from './sidebar/NavigationGroups';

const Sidebar: React.FC = () => {
  const { signOut, user } = useAuth();
  
  // Debug log for admin user status
  console.log('Sidebar rendering with user:', { 
    userId: user?.id, 
    userRole: user?.funcao,
    isAdmin: user?.funcao === 'admin' 
  });
  
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
      {/* Logo/Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-cross-blue rounded flex items-center justify-center text-white font-heading text-xl">
            CX
          </div>
          <span className="ml-3 text-white font-heading text-xl">CROSS</span>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active />
        
        {/* Modular Navigation Groups */}
        <AdminNavigationGroup />
        <ColetasNavigationGroup />
        <ArmazenagemNavigationGroup />
        <MotoristasNavigationGroup />
        <CadastrosNavigationGroup />
        
        {/* SAC Item */}
        <SidebarItem icon={MessageSquare} label="SAC" href="/sac" />
        
        {/* More Navigation Groups */}
        <ExpedicaoNavigationGroup />
        <RelatoriosNavigationGroup />
      </nav>
      
      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <SidebarItem icon={Settings} label="Configurações" href="/configuracoes" />
        <LogoutButton onLogout={handleLogout} />
      </div>
    </aside>
  );
};

export default Sidebar;
