
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LogoUpload from '@/components/empresa/LogoUpload';
import { useEmpresaLogo } from '@/hooks/useEmpresaLogo';
import { useAuth } from '@/hooks/useAuth';

const EmpresaLogoSection: React.FC = () => {
  const { user } = useAuth();
  const { logoUrl, setLogoUrl } = useEmpresaLogo(user?.user_metadata?.empresa_id);

  const handleLogoChange = (newLogoUrl: string | null) => {
    setLogoUrl(newLogoUrl);
  };

  if (!user?.user_metadata?.empresa_id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logo da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Informações da empresa não encontradas. Faça login novamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <LogoUpload
      empresaId={user.user_metadata.empresa_id}
      currentLogoUrl={logoUrl}
      onLogoChange={handleLogoChange}
    />
  );
};

export default EmpresaLogoSection;
