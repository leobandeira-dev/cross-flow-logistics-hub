
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active }) => {
  const location = useLocation();
  
  const handleClick = () => {
    console.log('Navigation: clicking sidebar item to:', href, 'from:', location.pathname);
  };

  return (
    <Link 
      to={href} 
      onClick={handleClick}
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

export default SidebarItem;
