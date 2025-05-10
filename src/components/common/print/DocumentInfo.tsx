
import React from 'react';
import { FileText } from 'lucide-react';

interface DocumentInfoProps {
  documentType: string;
  documentId: string;
}

/**
 * Component to display document information
 */
const DocumentInfo: React.FC<DocumentInfoProps> = ({
  documentType,
  documentId
}) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <FileText className="h-5 w-5 text-blue-500" />
      <p className="text-sm text-blue-700">
        Este documento ({documentType} - {documentId}) será gerado em formato PDF.
      </p>
    </div>
  );
};

export default DocumentInfo;
