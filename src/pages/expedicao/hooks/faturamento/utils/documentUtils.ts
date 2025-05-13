
import { format } from 'date-fns';

// In a real application, this counter would be stored in a database or local storage
let dailyCounter: { [key: string]: number } = {};

/**
 * Generates a document number in the format DDMMYY-X
 * where X is a sequential number for the day
 */
export const generateDocumentNumber = (): string => {
  const today = format(new Date(), 'ddMMyy');
  
  // Initialize counter for today if not exists
  if (!dailyCounter[today]) {
    dailyCounter[today] = 0;
  }
  
  // Increment counter
  dailyCounter[today]++;
  
  return `${today}-${dailyCounter[today]}`;
};

/**
 * Extracts information from a document number
 * Returns { date: Date, sequence: number } or null if invalid
 */
export const parseDocumentNumber = (documentNumber: string): { date: Date, sequence: number } | null => {
  const regex = /^(\d{2})(\d{2})(\d{2})-(\d+)$/;
  const match = documentNumber.match(regex);
  
  if (!match) {
    return null;
  }
  
  try {
    const [, day, month, year, sequence] = match;
    const dateStr = `20${year}-${month}-${day}`;
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return null;
    }
    
    return {
      date,
      sequence: parseInt(sequence, 10)
    };
  } catch (error) {
    return null;
  }
};
