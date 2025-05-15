
import { useState } from 'react';
import { Volume } from '../../components/etiquetas/VolumesTable';

/**
 * Hook for managing volume state
 */
export const useVolumeState = () => {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [generatedVolumes, setGeneratedVolumes] = useState<Volume[]>([]);

  return {
    volumes,
    generatedVolumes,
    setVolumes,
    setGeneratedVolumes
  };
};
