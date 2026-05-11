/** Convert a hex colour to rgba(r,g,b,a) */
export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Build a wa.me link with a pre-filled message */
export function buildWALink(baseLink: string, message: string): string {
  const number = baseLink.replace("https://wa.me/", "").split("?")[0];
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Format a naira price */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

/** Get initials from a display name (max 2 chars) */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
