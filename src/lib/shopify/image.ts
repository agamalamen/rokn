export function shopifyImageUrl(url: string, width: number): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}width=${width}`;
}
