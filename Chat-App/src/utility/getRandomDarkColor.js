export const getDarkColor = (text) => {
  if (!text) return 'hsl(0, 0%, 20%)'; // Fallback dark gray kung walang text

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Ginagawang Hue (0 hanggang 359) ang hash value
  const hue = Math.abs(hash) % 360;
  const saturation = 65; // Balanced saturation
  const lightness = 30;  // 30% lightness para siguradong madilim para sa white text

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Purely Random Dark Color Generator (nagbabago bawat tawag/render)
 */
export const getRandomDarkColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 20);
  const lightness = 25 + Math.floor(Math.random() * 15);
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};