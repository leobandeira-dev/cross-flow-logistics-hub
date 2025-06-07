
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoUploadFieldProps {
  transportadoraLogo?: string;
  onLogoChange: (file: File | null) => void;
}

const LogoUploadField: React.FC<LogoUploadFieldProps> = ({ transportadoraLogo, onLogoChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLogoChange(file);
    }
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="transportadora-logo">Logo da Transportadora (90x25mm)</Label>
      <div className="flex items-center gap-2">
        <Input
          id="transportadora-logo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="flex-1"
        />
        {transportadoraLogo && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveLogo}
            className="gap-1"
          >
            <X size={14} />
            Remover
          </Button>
        )}
      </div>
      {transportadoraLogo && (
        <div className="mt-2 p-2 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Upload size={14} />
            Logo carregada com sucesso
          </div>
          <div className="mt-1">
            <img 
              src={transportadoraLogo} 
              alt="Preview Logo" 
              className="max-h-16 object-contain border rounded"
            />
          </div>
        </div>
      )}
      <div className="text-xs text-gray-500">
        Dimensões recomendadas: 90mm x 25mm. Formatos suportados: JPG, PNG, GIF
      </div>
    </div>
  );
};

export default LogoUploadField;
