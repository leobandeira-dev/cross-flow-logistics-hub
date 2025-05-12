
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormLayoutProps {
  title: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = ({ title, children, footerContent }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {children}
        </div>
        
        {footerContent}
      </CardContent>
    </Card>
  );
};

export default FormLayout;
