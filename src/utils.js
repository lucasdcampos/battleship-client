export function resolveCosmeticUrl(link) {
  if (!link) return "/placeholder.png";

  // URL absoluta
  if (link.startsWith("http")) return link;

  // Já é relativo ao /public
  if (link.startsWith("/")) return link;

  // Nome simples → buscar em /public/
  return `/${link}`;
}
