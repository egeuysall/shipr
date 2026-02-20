export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function normalizeEmailToken(value: string, maxLength = 80): string {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

