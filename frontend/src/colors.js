// Deterministic color per bus line + direction, so each route keeps the same color.
export const stringToColor = (linea, direccion) => {
  const combinedString = linea + direccion;
  let hash = 0;
  for (let i = 0; i < combinedString.length; i++) {
    hash = combinedString.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 70;
  const lightness = 50;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
