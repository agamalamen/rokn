export const CATEGORY_BACKGROUNDS = [
  "#ffe27c",
  "#c4b1f9",
  "#b1d8fc",
  "#1b1b1b",
  "#fffbf4",
];

export function getCategoryBackgroundColor(index: number) {
  return CATEGORY_BACKGROUNDS[index % CATEGORY_BACKGROUNDS.length];
}

export function getCategoryLabelColor(backgroundColor: string) {
  return backgroundColor.toLowerCase() === "#1b1b1b" ? "#ffffff" : "#1b1b1b";
}
