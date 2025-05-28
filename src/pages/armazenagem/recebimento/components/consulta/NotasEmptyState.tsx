
import React from 'react';

interface NotasEmptyStateProps {
  isLoading: boolean;
  notasCount: number;
}

const NotasEmptyState: React.FC<NotasEmptyStateProps> = ({ isLoading, notasCount }) => {
  if (notasCount > 0 || isLoading) return null;

  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Nenhuma nota fiscal encontrada.</p>
    </div>
  );
};

export default NotasEmptyState;
