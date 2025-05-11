
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Upload, Loader2 } from 'lucide-react';

interface ImportarViaXMLProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

const ImportarViaXML: React.FC<ImportarViaXMLProps> = ({ onFileUpload, isLoading = false }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <FormItem>
            <FormLabel>Upload de Arquivo XML</FormLabel>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isLoading ? (
                    <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
                  ) : (
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  )}
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                  </p>
                  <p className="text-xs text-gray-500">XML (MAX. 10MB)</p>
                </div>
                <input 
                  id="dropzone-file" 
                  type="file" 
                  className="hidden" 
                  accept=".xml"
                  onChange={onFileUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
          </FormItem>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportarViaXML;
