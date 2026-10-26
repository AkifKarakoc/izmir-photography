// Placeholder photos from Unsplash (free license). These will be replaced
// with the photographer's own work, managed from the admin panel.

export type Category = 'wedding' | 'proposal' | 'couple' | 'place';

export interface Photo {
  id: string;
  alt: string;
  category: Category;
  tall?: boolean;
}

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

export const photos: Photo[] = [
  { id: 'photo-1779475501433-69a3a0b310f8', alt: 'Newlyweds walking through a sunny vineyard', category: 'wedding' },
  { id: 'photo-1519741497674-611481863552', alt: 'Groom beside the bride holding her bouquet', category: 'wedding', tall: true },
  { id: 'photo-1763129636696-0bda22154cf7', alt: 'Man proposing on the beach at sunset', category: 'proposal' },
  { id: 'photo-1606216794074-735e91aa2c92', alt: 'Married couple walking through a field', category: 'wedding', tall: true },
  { id: 'photo-1775717522396-5d56c0c9aeae', alt: 'Proposal on a boat at sunset', category: 'proposal' },
  { id: 'photo-1532712938310-34cb3982ef74', alt: 'Bride and groom walking on a hill', category: 'wedding' },
  { id: 'photo-1590632396158-a5765ff11bda', alt: 'Couple sitting on a wooden dock at sunset', category: 'couple', tall: true },
  { id: 'photo-1514432433435-ce2c7903dfba', alt: 'Man kneeling in front of a woman on a rock by the sea', category: 'proposal', tall: true },
  { id: 'photo-1546032996-6dfacbacbf3f', alt: 'Smiling newlyweds about to kiss in a green field', category: 'wedding' },
  { id: 'photo-1460978812857-470ed1c77af0', alt: 'Black and white portrait of bride and groom', category: 'wedding', tall: true },
  { id: 'photo-1766583463515-f8f5925faad2', alt: 'Proposal on a cliff overlooking the sea', category: 'proposal' },
  { id: 'photo-1629751450989-c3aa81267f7a', alt: 'Couple sharing a kiss', category: 'couple' },
  { id: 'photo-1591604466107-ec97de577aff', alt: 'Bride and groom portrait outdoors', category: 'wedding', tall: true },
  { id: 'photo-1542286777-b6499aa99a0a', alt: 'Putting the engagement ring on her finger', category: 'proposal' },
  { id: 'photo-1520854221256-17451cc331bf', alt: 'Close-up of a couple holding hands', category: 'couple' },
  { id: 'photo-1775126964671-43b4c1a1c5ce', alt: 'Bride and groom kissing outside an estate', category: 'wedding' },
  { id: 'photo-1763129636465-f4016848a06f', alt: 'Proposal setup on the beach at sunset', category: 'proposal', tall: true },
  { id: 'photo-1596457221755-b96bc3a6df18', alt: 'Groom kissing the bride', category: 'wedding' },
  { id: 'photo-1561287495-a3fe1fd28504', alt: 'Hands of a couple', category: 'couple', tall: true },
  { id: 'photo-1757647630063-dd5cd82271f3', alt: 'Couple walking down an arched hallway', category: 'wedding' },
];

export const places = {
  alacati: 'photo-1605209831726-aeb86db54124',
  urla: 'photo-1782150626809-eaff7c51ce5d',
  cesme: 'photo-1758971143133-707ea4b2056e',
  sirince: 'photo-1570177491571-318decb146b9',
  kordon: 'photo-1778629053302-a49f235fb7d9',
};
