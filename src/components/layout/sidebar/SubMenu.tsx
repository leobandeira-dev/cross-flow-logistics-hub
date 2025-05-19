
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SubMenuProps {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SubMenu: React.FC<SubMenuProps> = ({ label, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  const handleToggleSubmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="my-1">
      <button 
        onClick={handleToggleSubmenu}
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

export default SubMenu;
