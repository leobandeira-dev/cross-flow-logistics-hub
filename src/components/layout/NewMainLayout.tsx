
import React from 'react';
import TopNavbar from './TopNavbar';

interface NewMainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const NewMainLayout: React.FC<NewMainLayoutProps> = ({ children, title = "Dashboard" }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      
      <main className="container mx-auto px-4 py-6">
        {title && (
          <div className="mb-6">
            <h1 className="text-3xl font-heading text-cross-gray">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default NewMainLayout;
