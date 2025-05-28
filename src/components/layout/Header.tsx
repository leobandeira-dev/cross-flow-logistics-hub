
import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import ModernButton from '@/components/modern/ModernButton';
import ModernInput from '@/components/modern/ModernInput';
import { UserNotifications } from './UserNotifications';
import { UserProfileMenu } from './UserProfileMenu';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="glass-card border-b border-border/20 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
      <div className="fade-in">
        <h1 className="text-2xl font-heading bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-4 fade-in">
        <div className="relative">
          <ModernInput
            label="Buscar..."
            icon={<Search size={18} />}
            variant="standard"
            className="w-[200px] lg:w-[300px] h-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <UserNotifications />
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
