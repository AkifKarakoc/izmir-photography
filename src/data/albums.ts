// Portfolio albums. Each shoot is one album, shown as a book you can leaf
// through. Albums are edited in the admin panel and stored as content files
// (see src/content.config.ts); this module turns them into book pages.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

// An uploaded photo (optimised at build time) or a remote URL
export type Photo = ImageMetadata | string;

// Each album style has its own page language; the book engine is shared.
export type AlbumStyle = 'classic' | 'cinematic' | 'journal';
export type AlbumCategory = 'wedding' | 'proposal' | 'couple';

export const styleFor: Record<AlbumCategory, AlbumStyle> = {
  wedding: 'classic',
  proposal: 'cinematic',
  couple: 'journal',
};

export const categoryLabels: Record<AlbumCategory, string> = {
  wedding: 'Wedding',
  proposal: 'Proposal',
  couple: 'Couples & Honeymoon',
};

export type BookPage =
  | { type: 'title'; eyebrow?: string; title: string; text?: string; cta?: boolean }
  | { type: 'note'; text: string; sub?: string }
  // Empty paper, used to line wide spreads up on a left page
  | { type: 'blank' }
  // Classic (wedding)
  | { type: 'full'; photo: Photo }
  | { type: 'framed'; photo: Photo; caption?: string }
  | { type: 'stack'; photos: [Photo, Photo] }
  | { type: 'quad'; photos: [Photo, Photo, Photo, Photo] }
  | { type: 'offset'; photo: Photo; text: string }
  | { type: 'closing'; photo: Photo }
  // Cinematic (proposal)
  | { type: 'word'; word: string; caption?: string }
  | { type: 'filmstrip'; photos: Photo[]; captions: (string | undefined)[] }
  | { type: 'scene'; photo: Photo; caption?: string }
  | { type: 'darkfull'; photo: Photo; caption?: string }
  // Journal (couples & honeymoon)
  | { type: 'polaroids'; photos: [Photo, Photo, Photo]; captions: (string | undefined)[] }
  | { type: 'taped'; photo: Photo; note: string }
  | { type: 'stamp'; photo: Photo; place: string; coords?: string; note?: string }
  | { type: 'collage'; photos: [Photo, Photo, Photo]; note?: string };

// Layouts that take a whole spread: one photo across the inner halves with
// notes outside (panorama), or one photo across both pages (fullspread)
export type WidePage =
  | { type: 'panorama'; photo: Photo; leftText?: string; rightText?: string }
  | { type: 'fullspread'; photo: Photo; caption?: string };

// What a single page of the book renders
export type RenderedPage =
  | BookPage
  | { type: 'pano'; side: 'left' | 'right'; photo: Photo; text?: string }
  | { type: 'spread'; side: 'left' | 'right'; photo: Photo; caption?: string };

export interface BookAlbum {
  slug: string;
  style: AlbumStyle;
  category: AlbumCategory;
  title: string;
  subtitle: string;
  location: string;
  // Location page slugs (see site.ts) this shoot belongs to
  locations: string[];
  date: Date;
  cover: Photo;
  // A few paragraphs about the day, shown under the album (and read by Google)
  story: string[];
  pages: (BookPage | WidePage)[];
}

const isWide = (p: BookPage | WidePage): p is WidePage => p.type === 'panorama' || p.type === 'fullspread';

// Pages in reading order. Wide layouts always start on a left page (a blank
// page is slipped in when needed) and the book ends on a full spread.
// On narrow screens the book shows one page at a time, so wide layouts are
// shown whole instead of cut in two.
export function bookPages(album: BookAlbum, narrow = false): RenderedPage[] {
  const out: RenderedPage[] = [];
  for (const p of album.pages) {
    if (!isWide(p)) {
      out.push(p);
    } else if (narrow) {
      if (p.type === 'panorama') {
        out.push({ type: 'full', photo: p.photo });
        if (p.leftText || p.rightText) out.push({ type: 'note', text: p.leftText ?? '', sub: p.rightText });
      } else {
        out.push(
          album.style === 'cinematic'
            ? { type: 'darkfull', photo: p.photo, caption: p.caption }
            : { type: 'framed', photo: p.photo, caption: p.caption },
        );
      }
    } else {
      if (out.length % 2) out.push({ type: 'blank' });
      if (p.type === 'panorama')
        out.push(
          { type: 'pano', side: 'left', photo: p.photo, text: p.leftText },
          { type: 'pano', side: 'right', photo: p.photo, text: p.rightText },
        );
      else
        out.push({ type: 'spread', side: 'left', photo: p.photo }, { type: 'spread', side: 'right', photo: p.photo, caption: p.caption });
    }
  }
  if (!narrow && out.length % 2) out.push({ type: 'blank' });
  return out;
}

// Every photo in the album, cover first, without repeats
export function albumPhotos(album: BookAlbum): Photo[] {
  const all = album.pages.flatMap((p) => ('photos' in p ? p.photos : 'photo' in p ? [p.photo] : []));
  return [...new Set([album.cover, ...all])];
}

export const formatMonth = (d: Date) => d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

// --- From content files -------------------------------------------------------

type Entry = CollectionEntry<'albums'>;
type RawPage = Entry['data']['pages'][number];

function toPage(p: RawPage): BookPage | WidePage {
  switch (p.type) {
    case 'panorama':
      return { type: 'panorama', photo: p.photo, leftText: p.left_text, rightText: p.right_text };
    case 'stack':
      return { type: 'stack', photos: [p.top, p.bottom] };
    case 'quad':
      return { type: 'quad', photos: [p.photo_1, p.photo_2, p.photo_3, p.photo_4] };
    case 'filmstrip':
      return { type: 'filmstrip', photos: [p.photo_1, p.photo_2, p.photo_3], captions: [p.caption_1, p.caption_2, p.caption_3] };
    case 'polaroids':
      return { type: 'polaroids', photos: [p.photo_1, p.photo_2, p.photo_3], captions: [p.caption_1, p.caption_2, p.caption_3] };
    case 'collage':
      return { type: 'collage', photos: [p.photo_1, p.photo_2, p.photo_3], note: p.note };
    default:
      return p;
  }
}

function toAlbum(entry: Entry): BookAlbum {
  // id is "<category>/<slug>" (or ".../index", depending on the loader)
  const [category, slug] = entry.id.split('/') as [AlbumCategory, string];
  const d = entry.data;
  return {
    slug,
    category,
    style: styleFor[category],
    title: d.title,
    subtitle: d.subtitle,
    location: d.location,
    locations: d.locations,
    date: d.date,
    cover: d.cover,
    story: d.story.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
    pages: d.pages.map(toPage),
  };
}

// Published albums, newest first
export async function getAlbums(filter: { category?: AlbumCategory; location?: string } = {}): Promise<BookAlbum[]> {
  const entries = await getCollection('albums', (e: Entry) => !e.data.draft);
  return entries
    .map(toAlbum)
    .filter((a) => (!filter.category || a.category === filter.category) && (!filter.location || a.locations.includes(filter.location)))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
