export const CATEGORY_BACKGROUNDS = [
  "#9b3d4a",
  "#8b9199",
  "#1b2a4a",
  "#c4622d",
  "#6b8f71",
  "#5c7a6b",
  "#6b5b7a",
  "#7a2e3b",
  "#2d5a3d",
  "#8b6f7a",
  "#1e40af",
  "#9333ea",
  "#d97706",
  "#2dd4bf",
];

export function getCategoryBackgroundColor(index: number) {
  return CATEGORY_BACKGROUNDS[index % CATEGORY_BACKGROUNDS.length];
}
