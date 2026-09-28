/** Favicon generata dalle iniziali, come data URI SVG */
export function faviconFor(initials: string): string {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    '<rect width="64" height="64" rx="4" fill="#0e0c08"/>' +
    '<text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="ui-monospace,Consolas,monospace" font-size="26" font-weight="600" fill="#ffb000">' +
    initials.replace(/[<&>]/g, "") +
    "</text></svg>";
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
