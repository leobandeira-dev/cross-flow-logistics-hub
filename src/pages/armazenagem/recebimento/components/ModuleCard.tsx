
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon: Icon, link }) => {
  return (
    <Card className="hover:shadow-md transition-all cursor-pointer">
      <Link to={link}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Icon className="mr-2 text-cross-blue" size={20} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">{description}</p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ModuleCard;
