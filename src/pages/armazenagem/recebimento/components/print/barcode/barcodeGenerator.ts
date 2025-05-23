
/**
 * Generate Code 128C barcode SVG for NFe access key
 * Compliant with MOC 7.0 specifications:
 * - Minimum width: 6cm for laser/inkjet printers, 11.5cm for matrix printers
 * - Minimum height: 0.8cm (8mm)
 * - Clear margin of at least 10 modules
 * - Module 103 verification algorithm
 *
 * @param accessKey The 44-digit NFe access key
 * @returns SVG string with the barcode
 */
export const generateCode128Barcode = (accessKey: string): string => {
  // Ensure we have exactly 44 digits
  if (!accessKey || accessKey.length !== 44 || !/^\d+$/.test(accessKey)) {
    console.error('Invalid access key format. Must be 44 digits:', accessKey);
    return '<svg width="250" height="30"><text x="10" y="20" fill="red">Invalid access key</text></svg>';
  }

  // CODE 128C encoding - uses pairs of digits as single characters
  const code128CPatterns = [
    "11011001100", "11001101100", "11001100110", "10010011000", 
    "10010001100", "10001001100", "10011001000", "10011000100", 
    "10001100100", "11001001000", "11001000100", "11000100100", 
    "10110011100", "10011011100", "10011001110", "10111001100", 
    "10011101100", "10011100110", "11001110010", "11001011100", 
    "11001001110", "11011100100", "11001110100", "11101101110", 
    "11101001100", "11100101100", "11100100110", "11101100100", 
    "11100110100", "11100110010", "11011011000", "11011000110", 
    "11000110110", "10100011000", "10001011000", "10001000110", 
    "10110001000", "10001101000", "10001100010", "11010001000", 
    "11000101000", "11000100010", "10110111000", "10110001110", 
    "10001101110", "10111011000", "10111000110", "10001110110", 
    "11101110110", "11010001110", "11000101110", "11011101000", 
    "11011100010", "11011101110", "11101011000", "11101000110", 
    "11100010110", "11101101000", "11101100010", "11100011010", 
    "11101111010", "11001000010", "11110001010", "10100110000", 
    "10100001100", "10010110000", "10010000110", "10000101100", 
    "10000100110", "10110010000", "10110000100", "10011010000", 
    "10011000010", "10000110100", "10000110010", "11000010010", 
    "11001010000", "11110111010", "11000010100", "10001111010", 
    "10100111100", "10010111100", "10010011110", "10111100100", 
    "10011110100", "10011110010", "11110100100", "11110010100", 
    "11110010010", "11011011110", "11011110110", "11110110110", 
    "10101111000", "10100011110", "10001011110", "10111101000", 
    "10111100010", "11110101000", "11110100010", "10111011110", 
    "10111101110", "11101011110", "11110101110", "11010000100", 
    "11010010000", "11010011100", "11000111010"
  ];
  
  // Start with START C (105)
  let barcodeValue = 105;
  let barcodePattern = "11010011100"; // START C
  
  // Process pairs of digits
  for (let i = 0; i < accessKey.length; i += 2) {
    const pairValue = parseInt(accessKey.substr(i, 2));
    barcodeValue += (i / 2 + 1) * pairValue; // Weight for checksum
    barcodePattern += code128CPatterns[pairValue];
  }
  
  // Calculate check digit
  const checkDigit = (barcodeValue % 103);
  barcodePattern += code128CPatterns[checkDigit];
  
  // Add STOP pattern
  barcodePattern += "1100011101011"; // STOP
  
  // Generate SVG
  // Total width including clear margins
  const moduleWidth = 1;
  const clearMargin = 10 * moduleWidth;
  const totalWidth = barcodePattern.length * moduleWidth + 2 * clearMargin;
  const height = 30; // Minimum 8mm (30px)
  
  let svg = `<svg width="${totalWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${totalWidth}" height="${height}" fill="white"/>`;
  
  // Add the barcode
  let currentX = clearMargin;
  
  for (let i = 0; i < barcodePattern.length; i++) {
    if (barcodePattern.charAt(i) === '1') {
      svg += `<rect x="${currentX}" y="0" width="${moduleWidth}" height="${height}" fill="black"/>`;
    }
    currentX += moduleWidth;
  }
  
  svg += '</svg>';
  return svg;
};
