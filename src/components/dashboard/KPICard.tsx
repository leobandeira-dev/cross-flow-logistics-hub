
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  unit = '', 
  trend 
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
        <div className="p-4">
          <div className="flex items-baseline">
            <h3 className="text-2xl font-bold">{value}</h3>
            {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
          </div>
          
          {trend && (
            <p className={`text-xs flex items-center mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-gray-500 ml-1">vs. último período</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
