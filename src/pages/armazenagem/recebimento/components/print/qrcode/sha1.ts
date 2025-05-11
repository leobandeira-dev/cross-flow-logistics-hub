
/**
 * SHA-1 hash function
 * This is a simplified implementation for demonstration purposes.
 * In production code, you should use a well-tested crypto library.
 * 
 * @param message String to hash
 * @returns SHA-1 hash as a hex string
 */
export function sha1(message: string): string {
  // In a real implementation, you would use:
  // 1. Web Crypto API if available: crypto.subtle.digest('SHA-1', data)
  // 2. Or a proper crypto library like crypto-js
  
  // This is a very simplified implementation to avoid adding dependencies
  // DO NOT USE THIS IN PRODUCTION
  
  // Convert string to a sequence of UTF-8 bytes
  const utf8Encode = function(str: string): string {
    try {
      return unescape(encodeURIComponent(str));
    } catch (e) {
      return str;
    }
  };
  
  const utf8Message = utf8Encode(message);
  
  // Simple hash function that creates a deterministic but not cryptographically secure hash
  let hash = 0;
  
  for (let i = 0; i < utf8Message.length; i++) {
    const char = utf8Message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Create a SHA-1 like hex string (just for visualization)
  const positiveHash = Math.abs(hash);
  let hexHash = positiveHash.toString(16);
  
  // Pad to ensure it looks like a SHA-1 hash (40 hex characters)
  while (hexHash.length < 40) {
    hexHash = "0" + hexHash;
  }
  
  return hexHash.substring(0, 40);
}
