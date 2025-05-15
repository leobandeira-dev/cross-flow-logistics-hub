
import { useState } from 'react';
import { Volume } from '../../components/etiquetas/VolumesTable';

/**
 * Hook for managing etiquetas state
 */
export const useEtiquetasState = () => {
  const [generatedVolumes, setGeneratedVolumes] = useState<Volume[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [etiquetasMae, setEtiquetasMae] = useState<any[]>([]);

  return {
    volumes,
    generatedVolumes,
    etiquetasMae,
    setVolumes,
    setGeneratedVolumes,
    setEtiquetasMae
  };
};
