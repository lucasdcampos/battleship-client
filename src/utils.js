// utils.js

export function resolveCosmeticUrl(link, fallback = "/placeholder.png") {
  if (!link || typeof link !== "string") return fallback;

  if (link.startsWith("http")) return link;

  if (link.startsWith("/")) return link;

  return `/${link}`;
}
