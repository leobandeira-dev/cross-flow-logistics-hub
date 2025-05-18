
// Format number to Brazilian format with 2 or 3 decimals
export const formatarNumero = (numero: number, decimais: number = 3): string => {
  return numero.toLocaleString('pt-BR', { 
    minimumFractionDigits: decimais, 
    maximumFractionDigits: decimais 
  });
};

// Format currency in Brazilian Real (R$)
export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
};
