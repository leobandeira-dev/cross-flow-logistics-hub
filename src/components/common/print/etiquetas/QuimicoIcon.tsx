
import React from 'react';
import { TestTube } from 'lucide-react';

const QuimicoIcon: React.FC = () => {
  return (
    <div className="absolute top-3 right-3">
      <TestTube size={24} className="text-red-500" />
    </div>
  );
};

export default QuimicoIcon;
