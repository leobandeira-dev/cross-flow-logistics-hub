
import React from 'react';
import StatCard from '../../../components/dashboard/StatCard';
import { Truck, Package, AlertCircle, FileText } from 'lucide-react';

const StatCardsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard 
        title="Coletas Pendentes" 
        value="24" 
        icon={<Truck className="text-cross-blue" />}
        trend={{ value: 8, positive: true }}
        color="blue"
      />
      <StatCard 
        title="Cargas em Trânsito" 
        value="36" 
        icon={<Package className="text-cross-gray" />}
        trend={{ value: 12, positive: true }}
        color="gray"
      />
      <StatCard 
        title="Ocorrências Abertas" 
        value="7" 
        icon={<AlertCircle className="text-cross-error" />}
        trend={{ value: 2, positive: false }}
        color="red"
      />
      <StatCard 
        title="Expedições Hoje" 
        value="18" 
        icon={<FileText className="text-cross-success" />}
        trend={{ value: 5, positive: true }}
        color="green"
      />
    </div>
  );
};

export default StatCardsSection;
