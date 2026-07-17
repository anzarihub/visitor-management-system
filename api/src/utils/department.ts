export function isValidHex(color: string): boolean {
   return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
   const value = hex.replace('#', '');
   return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
   };
}

// Euclidean distance in RGB space — lower means more visually similar
export function colorDistance(hexA: string, hexB: string): number {
   const a = hexToRgb(hexA);
   const b = hexToRgb(hexB);

   return Math.sqrt(
      Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2),
   );
}

// Max possible distance is ~441.7 (black to white); a threshold around 60-80
// catches near-identical shades while still allowing genuinely distinct colors
export const SIMILARITY_THRESHOLD = 60;
