
import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <button 
      className="flex items-center gap-3 py-3 px-4 text-sidebar-foreground/70 hover:text-sidebar-foreground w-full rounded-md transition-colors"
      onClick={onLogout}
    >
      <LogOut size={20} />
      <span>Sair</span>
    </button>
  );
};

export default LogoutButton;
