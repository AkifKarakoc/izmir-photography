// Placeholder photos from Unsplash (free license) for the fixed parts of the
// site (hero, banners, locations). Album photos come from the admin panel.

export function img(id: string, width = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=75`;
}

export function srcset(id: string) {
  return [480, 800, 1200, 1800].map((w) => `${img(id, w)} ${w}w`).join(', ');
}

// Remote photo URLs used in albums: Unsplash can resize on request, other
// hosts are used as they are
const isUnsplash = (url: string) => url.startsWith('https://images.unsplash.com/');

export function remoteSrc(url: string, width: number) {
  return isUnsplash(url) ? `${url.split('?')[0]}?auto=format&fit=crop&w=${width}&q=75` : url;
}

export function remoteSrcset(url: string, widths: number[]) {
  return isUnsplash(url) ? widths.map((w) => `${remoteSrc(url, w)} ${w}w`).join(', ') : undefined;
}

export const places = {
  alacati: 'photo-1605209831726-aeb86db54124',
  urla: 'photo-1782150626809-eaff7c51ce5d',
  cesme: 'photo-1758971143133-707ea4b2056e',
  sirince: 'photo-1570177491571-318decb146b9',
  kordon: 'photo-1778629053302-a49f235fb7d9',
};
