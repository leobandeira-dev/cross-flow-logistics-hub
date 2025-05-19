
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Calculate the active state
  const isActive = active || location.pathname === href || 
                (href !== '/' && location.pathname.startsWith(href));

  // For admin routes, check user permissions
  const isAdminRoute = href.startsWith('/admin');
  const hasAdminAccess = user?.funcao === 'admin';
  
  // Console log for debugging
  if (isAdminRoute) {
    console.log(`SidebarItem "${label}" - Admin route check:`, { 
      hasAdminAccess, 
      userRole: user?.funcao 
    });
  }
  
  // Don't render admin links for non-admin users
  if (isAdminRoute && !hasAdminAccess) {
    return null;
  }
  
  return (
    <Link 
      to={href} 
      className={`flex items-center gap-3 py-3 px-4 rounded-md transition-colors
        ${isActive 
          ? 'bg-sidebar-accent text-sidebar-foreground' 
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'
        }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;
