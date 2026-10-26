// Content edited from the admin panel (public/admin/config.yml).
// Site settings (src/content/settings/site.json) are imported directly by
// src/data/site.ts. Albums live in src/content/albums/<category>/<slug>/index.json, with their
// uploaded photos in the same folder.
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A photo is either an uploaded file next to the album (optimised at build
// time) or a remote URL (the Unsplash placeholders).
const photo = ({ image }: SchemaContext) =>
  z.union([
    z.url(),
    // The panel may save "photo.jpg"; Astro resolves it relative to the album file
    z.preprocess((v) => (typeof v === 'string' && !/^(\.{1,2}\/|\/)/.test(v) ? `./${v}` : v), image()),
  ]);

// Each page layout, as the panel saves it. Turned into the shape the book
// renders in src/data/albums.ts.
const pages = (ctx: SchemaContext) => {
  const p = photo(ctx);
  const text = z.string().optional();
  return z.discriminatedUnion('type', [
    z.object({ type: z.literal('title'), eyebrow: text, title: z.string(), text, cta: z.boolean().optional() }),
    z.object({ type: z.literal('note'), text: z.string(), sub: text }),
    z.object({ type: z.literal('panorama'), photo: p, left_text: text, right_text: text }),
    z.object({ type: z.literal('fullspread'), photo: p, caption: text }),
    // Classic
    z.object({ type: z.literal('full'), photo: p }),
    z.object({ type: z.literal('framed'), photo: p, caption: text }),
    z.object({ type: z.literal('stack'), top: p, bottom: p }),
    z.object({ type: z.literal('quad'), photo_1: p, photo_2: p, photo_3: p, photo_4: p }),
    z.object({ type: z.literal('offset'), photo: p, text: z.string() }),
    z.object({ type: z.literal('closing'), photo: p }),
    // Cinematic
    z.object({ type: z.literal('word'), word: z.string(), caption: text }),
    z.object({
      type: z.literal('filmstrip'),
      photo_1: p,
      photo_2: p,
      photo_3: p,
      caption_1: text,
      caption_2: text,
      caption_3: text,
    }),
    z.object({ type: z.literal('scene'), photo: p, caption: text }),
    z.object({ type: z.literal('darkfull'), photo: p, caption: text }),
    // Journal
    z.object({
      type: z.literal('polaroids'),
      photo_1: p,
      photo_2: p,
      photo_3: p,
      caption_1: text,
      caption_2: text,
      caption_3: text,
    }),
    z.object({ type: z.literal('taped'), photo: p, note: z.string() }),
    z.object({ type: z.literal('stamp'), photo: p, place: z.string(), coords: text, note: text }),
    z.object({ type: z.literal('collage'), photo_1: p, photo_2: p, photo_3: p, note: text }),
  ]);
};

const albums = defineCollection({
  loader: glob({ pattern: '*/*/index.json', base: './src/content/albums' }),
  schema: (ctx) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      location: z.string(),
      locations: z.array(z.string()).default([]),
      date: z.coerce.date(),
      cover: photo(ctx),
      story: z.string().default(''),
      draft: z.boolean().default(false),
      pages: z.array(pages(ctx)).default([]),
    }),
});

export const collections = { albums };
