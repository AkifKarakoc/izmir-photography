// Portfolio albums. Each shoot is one album, shown as a book you can leaf
// through. A book is designed in spreads (the two facing pages), like a
// printed album. Later these come from the admin panel.

// Each album style has its own page language; the book engine is shared.
export type AlbumStyle = 'classic' | 'cinematic' | 'journal';

export type BookPage =
  // Classic (wedding)
  | { type: 'title'; eyebrow?: string; title: string; text?: string; cta?: boolean }
  | { type: 'full'; photo: string }
  | { type: 'framed'; photo: string; caption?: string }
  | { type: 'stack'; photos: [string, string] }
  | { type: 'quad'; photos: [string, string, string, string] }
  | { type: 'offset'; photo: string; text: string }
  | { type: 'closing'; photo: string }
  // A page with a single sentence, used when wide spreads are folded for phones
  | { type: 'note'; text: string; sub?: string }
  // Cinematic (proposal)
  | { type: 'word'; word: string; caption?: string }
  | { type: 'filmstrip'; photos: string[]; captions?: string[] }
  | { type: 'scene'; photo: string; caption?: string }
  | { type: 'darkfull'; photo: string; caption?: string }
  // Journal (couples & honeymoon)
  | { type: 'polaroids'; photos: [string, string, string]; captions: [string, string, string] }
  | { type: 'taped'; photo: string; note: string }
  | { type: 'stamp'; photo: string; place: string; coords: string; note: string }
  | { type: 'collage'; photos: [string, string, string]; note?: string };

export type Spread =
  | { type: 'pages'; left: BookPage; right: BookPage }
  // One photo across the inner halves of both pages, notes on the outer halves
  | { type: 'panorama'; photo: string; leftText: string; rightText: string }
  // One photo across the whole spread
  | { type: 'fullspread'; photo: string; caption?: string };

// What a single page renders after a spread is cut into its two pages
export type RenderedPage =
  | BookPage
  | { type: 'pano'; side: 'left' | 'right'; photo: string; text: string }
  | { type: 'spread'; side: 'left' | 'right'; photo: string; caption?: string };

export type AlbumCategory = 'wedding' | 'proposal' | 'couple';

export interface BookAlbum {
  slug: string;
  style: AlbumStyle;
  category: AlbumCategory;
  // Location page slugs (see site.ts) this shoot belongs to
  locations: string[];
  // A few sentences about the day, shown under the album (and read by Google)
  story: string[];
  title: string;
  subtitle: string;
  location: string;
  date: string;
  cover: string;
  spreads: Spread[];
}

// Pages in reading order. On narrow screens the book shows one page at a time,
// so photos that cross the spine are shown whole instead of cut in two.
export function bookPages(album: BookAlbum, narrow = false): RenderedPage[] {
  return album.spreads.flatMap((s): RenderedPage[] => {
    if (s.type === 'pages') return [s.left, s.right];
    if (s.type === 'panorama')
      return narrow
        ? [
            { type: 'full', photo: s.photo },
            { type: 'note', text: s.leftText, sub: s.rightText },
          ]
        : [
            { type: 'pano', side: 'left', photo: s.photo, text: s.leftText },
            { type: 'pano', side: 'right', photo: s.photo, text: s.rightText },
          ];
    if (narrow)
      return [
        album.style === 'cinematic'
          ? { type: 'darkfull', photo: s.photo, caption: s.caption }
          : { type: 'framed', photo: s.photo, caption: s.caption },
      ];
    return [
      { type: 'spread', side: 'left', photo: s.photo },
      { type: 'spread', side: 'right', photo: s.photo, caption: s.caption },
    ];
  });
}

export const sampleBook: BookAlbum = {
  slug: 'emma-james-urla-vineyard-wedding',
  style: 'classic',
  category: 'wedding',
  locations: ['urla'],
  story: [
    'Emma and James flew in from London for an intimate vineyard wedding in Urla, with forty guests, long tables between the vines and a ceremony timed for the golden hour.',
    'Placeholder text: the real story of each shoot goes here, a few sentences about the couple, the place and the light.',
  ],
  title: 'Emma & James',
  subtitle: 'A vineyard wedding',
  location: 'Urla, Izmir',
  date: 'September 2026',
  cover: 'photo-1779475501433-69a3a0b310f8',
  spreads: [
    {
      type: 'pages',
      left: { type: 'title', eyebrow: 'Urla · September 2026', title: 'Emma & James', text: 'A vineyard wedding' },
      right: { type: 'framed', photo: 'photo-1519741497674-611481863552', caption: 'The first look' },
    },
    {
      type: 'panorama',
      photo: 'photo-1606216794074-735e91aa2c92',
      leftText: '“We wanted our wedding to feel like a long, slow summer evening.”',
      rightText: 'A walk through the vines just before the ceremony, while the guests found their seats.',
    },
    {
      type: 'pages',
      left: { type: 'stack', photos: ['photo-1532712938310-34cb3982ef74', 'photo-1546032996-6dfacbacbf3f'] },
      right: { type: 'full', photo: 'photo-1591604466107-ec97de577aff' },
    },
    {
      type: 'pages',
      left: {
        type: 'quad',
        photos: ['photo-1520854221256-17451cc331bf', 'photo-1561287495-a3fe1fd28504', 'photo-1596457221755-b96bc3a6df18', 'photo-1629751450989-c3aa81267f7a'],
      },
      right: { type: 'offset', photo: 'photo-1460978812857-470ed1c77af0', text: 'The quiet moments, in between all the plans.' },
    },
    { type: 'fullspread', photo: 'photo-1775126964671-43b4c1a1c5ce', caption: 'Golden hour at the estate' },
    {
      type: 'pages',
      left: { type: 'framed', photo: 'photo-1590632396158-a5765ff11bda', caption: 'After the party' },
      right: { type: 'stack', photos: ['photo-1757647630063-dd5cd82271f3', 'photo-1550784718-990c6de52adf'] },
    },
    {
      type: 'pages',
      left: { type: 'title', title: 'Could yours be next?', text: 'Let’s create your own album in Izmir.', cta: true },
      right: { type: 'closing', photo: 'photo-1606216794079-73f85bbd57d5' },
    },
  ],
};

export const proposalBook: BookAlbum = {
  slug: 'sophie-daniel-alacati-proposal',
  style: 'cinematic',
  category: 'proposal',
  locations: ['alacati', 'cesme'],
  story: [
    'Daniel planned everything in secret: a beach setup at sunset, a hidden photographer and a ring he had carried for three days. Sophie thought they were just going for dinner.',
    'Placeholder text: the real story of each proposal goes here.',
  ],
  title: 'Sophie & Daniel',
  subtitle: 'A surprise proposal',
  location: 'Alaçatı, Izmir',
  date: 'June 2026',
  cover: 'photo-1763129636696-0bda22154cf7',
  spreads: [
    {
      type: 'pages',
      left: { type: 'title', eyebrow: 'A surprise proposal', title: 'Sophie & Daniel', text: 'Alaçatı · June 2026' },
      right: { type: 'scene', photo: 'photo-1763129636465-f4016848a06f', caption: '18:55 · Everything is ready' },
    },
    {
      type: 'pages',
      left: {
        type: 'filmstrip',
        photos: ['photo-1514432433435-ce2c7903dfba', 'photo-1480185378309-ff10682412df', 'photo-1542286777-b6499aa99a0a'],
        captions: ['19:40', '19:41', '19:42'],
      },
      right: { type: 'word', word: 'Yes.', caption: '19:42 · Alaçatı' },
    },
    { type: 'fullspread', photo: 'photo-1763129636696-0bda22154cf7', caption: 'Golden hour on the beach' },
    {
      type: 'pages',
      left: { type: 'darkfull', photo: 'photo-1775717522396-5d56c0c9aeae', caption: 'Later that evening, on the water' },
      right: { type: 'scene', photo: 'photo-1579555973297-560c43ca7562', caption: 'The ring' },
    },
    {
      type: 'pages',
      left: { type: 'scene', photo: 'photo-1766583463515-f8f5925faad2', caption: 'Above the sea' },
      right: {
        type: 'filmstrip',
        photos: ['photo-1629751450989-c3aa81267f7a', 'photo-1590632396158-a5765ff11bda', 'photo-1517910306750-d49c0fa41fb1'],
      },
    },
    {
      type: 'pages',
      left: { type: 'title', title: 'Planning a surprise?', text: 'I’ll stay hidden until the big moment.', cta: true },
      right: { type: 'word', word: 'Forever.', caption: 'The beginning' },
    },
  ],
};

export const journalBook: BookAlbum = {
  slug: 'mia-leo-izmir-honeymoon',
  style: 'journal',
  category: 'couple',
  locations: ['kordon', 'sirince', 'alacati', 'urla', 'cesme'],
  story: [
    'Mia and Leo spent their honeymoon week exploring Izmir. We met at a few of their favourite spots along the way: the Kordon at sunset, a slow breakfast in Şirince and the stone streets of Alaçatı.',
    'Placeholder text: the real story of each trip goes here.',
  ],
  title: 'Our week in Izmir',
  subtitle: 'Mia & Leo · Honeymoon',
  location: 'Izmir',
  date: 'May 2026',
  cover: 'photo-1590632396158-a5765ff11bda',
  spreads: [
    {
      type: 'pages',
      left: { type: 'title', eyebrow: 'May 2026', title: 'Our week in Izmir', text: 'Mia & Leo · Honeymoon' },
      right: { type: 'taped', photo: 'photo-1590632396158-a5765ff11bda', note: 'Day 1 · first sunset by the sea' },
    },
    {
      type: 'pages',
      left: {
        type: 'polaroids',
        photos: ['photo-1778629053302-a49f235fb7d9', 'photo-1629751450989-c3aa81267f7a', 'photo-1520854221256-17451cc331bf'],
        captions: ['Kordon', 'us', 'Kemeraltı'],
      },
      right: {
        type: 'stamp',
        photo: 'photo-1570177491571-318decb146b9',
        place: 'Şirince',
        coords: '37.94° N · 27.43° E',
        note: 'Wine tasting and the slowest breakfast ever.',
      },
    },
    {
      type: 'panorama',
      photo: 'photo-1605209831726-aeb86db54124',
      leftText: 'Day 4 · Alaçatı’s stone streets',
      rightText: 'We got lost on purpose. Twice.',
    },
    {
      type: 'pages',
      left: {
        type: 'collage',
        photos: ['photo-1561287495-a3fe1fd28504', 'photo-1546032996-6dfacbacbf3f', 'photo-1782150626809-eaff7c51ce5d'],
        note: 'Urla, between the vineyards',
      },
      right: { type: 'taped', photo: 'photo-1532712938310-34cb3982ef74', note: 'The hill we almost didn’t climb' },
    },
    {
      type: 'pages',
      left: {
        type: 'polaroids',
        photos: ['photo-1758971143133-707ea4b2056e', 'photo-1606216794074-735e91aa2c92', 'photo-1591604466107-ec97de577aff'],
        captions: ['Çeşme', 'last day', 'see you soon'],
      },
      right: { type: 'title', title: 'Your trip, your story', text: 'Holiday and honeymoon sessions all around Izmir.', cta: true },
    },
  ],
};

export const albums = [sampleBook, proposalBook, journalBook];

export const categoryLabels: Record<AlbumCategory, string> = {
  wedding: 'Wedding',
  proposal: 'Proposal',
  couple: 'Couples & Honeymoon',
};

export const albumsFor = (filter: { category?: AlbumCategory; location?: string }) =>
  albums.filter(
    (a) => (!filter.category || a.category === filter.category) && (!filter.location || a.locations.includes(filter.location)),
  );
