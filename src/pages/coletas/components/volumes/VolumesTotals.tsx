import React from 'react';
import { VolumeItem, calcularVolume, formatarNumero } from '../../utils/volumeCalculations';

interface VolumesTotalsProps {
  volumes: VolumeItem[];
  pesoTotal?: number;
}

const VolumesTotals: React.FC<VolumesTotalsProps> = ({ volumes, pesoTotal }) => {
  // Calculate totals
  let totalVolumes = 0;
  let totalPeso = 0;
  let totalM3 = 0;

  volumes.forEach(vol => {
    const volumeCalculado = calcularVolume(vol);
    totalVolumes += vol.quantidade;
    totalM3 += volumeCalculado;
  });

  // Use the provided fixed weight if available
  if (pesoTotal !== undefined) {
    totalPeso = pesoTotal;
  } else {
    // Otherwise calculate from volumes
    volumes.forEach(vol => {
      totalPeso += vol.peso * vol.quantidade;
    });
  }

  return (
    <>
      {/* Totals row */}
      <tr className="border-t bg-gray-50">
        <td colSpan={4} className="p-2 text-right font-medium">Totais:</td>
        <td className="p-2 font-semibold">{totalVolumes}</td>
        <td className="p-2 font-semibold">{formatarNumero(totalM3)}</td>
        <td className="p-2"></td>
      </tr>
    </>
  );
};

export default VolumesTotals;
