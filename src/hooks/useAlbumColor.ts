import { useEffect, useState } from 'react';

const colorCache = new Map<string, string>();

/** Sample a 48×48 downscale of the image and return the most vibrant pixel color. */
async function extractVibrant(url: string): Promise<string | null> {
  if (colorCache.has(url)) return colorCache.get(url)!;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const SIZE = 48;
      const canvas = document.createElement('canvas');
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }

      ctx.drawImage(img, 0, 0, SIZE, SIZE);

      let pixels: ImageData;
      try {
        pixels = ctx.getImageData(0, 0, SIZE, SIZE);
      } catch {
        // CORS blocked canvas read – fall back gracefully
        resolve(null);
        return;
      }

      const { data } = pixels;
      let bestScore = 0;
      let bestR = 255, bestG = 107, bestB = 0; // amber fallback

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const nr = r / 255, ng = g / 255, nb = b / 255;
        const max = Math.max(nr, ng, nb);
        const min = Math.min(nr, ng, nb);
        const saturation = max === 0 ? 0 : (max - min) / max;
        const brightness = max;

        // Favour vibrant colours that are bright enough to be legible
        const score = saturation * brightness;
        if (score > bestScore && brightness > 0.28 && brightness < 0.94) {
          bestScore = score;
          bestR = r; bestG = g; bestB = b;
        }
      }

      const hex = `#${bestR.toString(16).padStart(2, '0')}${bestG.toString(16).padStart(2, '0')}${bestB.toString(16).padStart(2, '0')}`;
      colorCache.set(url, hex);
      resolve(hex);
    };

    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export function useAlbumColor(imageUrl: string | null | undefined): string | null {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) { setColor(null); return; }
    extractVibrant(imageUrl).then(setColor);
  }, [imageUrl]);

  return color;
}
