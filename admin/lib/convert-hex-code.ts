export function expandHexCode(hex: string) {
  // Validate hex code length
  if (hex.length !== 4) {
    return hex; // Return original if not shorthand
  }

  // Extract individual characters
  const r = hex[1];
  const g = hex[2];
  const b = hex[3];

  // Duplicate each character to create full hex code
  return "#" + r + r + g + g + b + b;
}
