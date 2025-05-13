
import React, { ReactNode } from 'react';

interface FormSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, className }) => {
  return (
    <div className={className}>
      {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
      {children}
    </div>
  );
};

export default FormSection;
