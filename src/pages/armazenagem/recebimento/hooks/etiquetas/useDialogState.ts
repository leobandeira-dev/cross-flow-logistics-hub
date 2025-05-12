
import { useState } from 'react';
import { Volume } from '../../components/etiquetas/VolumesTable';

/**
 * Hook for managing dialog states in the etiquetas interface
 */
export const useDialogState = () => {
  const [classifyDialogOpen, setClassifyDialogOpen] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);

  // Function to handle opening classify dialog
  const openClassifyDialog = (volume: Volume) => {
    setSelectedVolume(volume);
    setClassifyDialogOpen(true);
  };

  // Function to handle closing classify dialog
  const closeClassifyDialog = () => {
    setClassifyDialogOpen(false);
    setSelectedVolume(null);
  };

  return {
    classifyDialogOpen,
    selectedVolume,
    setClassifyDialogOpen,
    setSelectedVolume,
    openClassifyDialog,
    closeClassifyDialog
  };
};
