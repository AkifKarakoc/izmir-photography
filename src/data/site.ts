import { places } from './photos';
// Edited in the admin panel under "Site settings"
import settings from '../content/settings/site.json';

export const site = {
  brand: settings.brand,
  tagline: settings.tagline,
  whatsapp: settings.whatsapp.replace(/\D/g, ''),
  email: settings.email,
  instagram: settings.instagram,
  city: 'Izmir',
};

export const whatsappLink = (text = 'Hi! I would like to check your availability.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export interface Service {
  slug: string;
  title: string;
  short: string;
  h1: string;
  intro: string;
  cover: string;
  // Starting price, set in the admin panel; empty means "on request"
  from: string;
  includes: string[];
  category: 'wedding' | 'proposal' | 'couple';
}

export const services: Service[] = [
  {
    slug: 'wedding-photographer-izmir',
    title: 'Weddings',
    short: 'Full-day and elopement coverage, from getting ready to the last dance.',
    h1: 'Wedding Photographer in Izmir',
    intro:
      'Getting married on the Aegean coast? From vineyard ceremonies in Urla to seaside receptions in Çeşme, I document your day calmly and honestly, so you can stay in the moment while I take care of the memories.',
    cover: 'photo-1779475501433-69a3a0b310f8',
    from: settings.prices.wedding,
    includes: ['Up to 10 hours of coverage', '500+ edited photos', 'Private online gallery', 'Location scouting help', 'Delivery within 3 weeks'],
    category: 'wedding',
  },
  {
    slug: 'proposal-photographer-izmir',
    title: 'Proposals',
    short: 'Secret, hidden-camera proposal shoots, planned together down to the minute.',
    h1: 'Proposal Photographer in Izmir',
    intro:
      'Planning to pop the question? I help you choose the perfect spot, stay hidden until the big moment, and then guide a relaxed mini shoot for the two of you. She will never see it coming.',
    cover: 'photo-1763129636696-0bda22154cf7',
    from: settings.prices.proposal,
    includes: ['Planning call & spot suggestions', 'Hidden photographer during the moment', '30–60 min couple shoot after', '80+ edited photos', 'Sneak peek within 48 hours'],
    category: 'proposal',
  },
  {
    slug: 'couple-photoshoot-izmir',
    title: 'Couples & Honeymoon',
    short: 'Holiday, honeymoon and anniversary sessions in the most beautiful corners of Izmir.',
    h1: 'Couple & Honeymoon Photoshoot in Izmir',
    intro:
      'On holiday in Izmir? Turn your trip into lasting memories with a relaxed photo session in the stone streets of Alaçatı, the vineyards of Urla or along the Kordon at sunset. No posing experience needed.',
    cover: 'photo-1590632396158-a5765ff11bda',
    from: settings.prices.couple,
    includes: ['1–2 hour session', 'One or two locations', '60+ edited photos', 'Outfit & timing tips', 'Delivery within 1 week'],
    category: 'couple',
  },
];

export interface Location {
  slug: string;
  name: string;
  cover: string;
  blurb: string;
  description: string[];
  bestTime: string;
  spots: string[];
}

export const locations: Location[] = [
  {
    slug: 'alacati',
    name: 'Alaçatı',
    cover: places.alacati,
    blurb: 'Stone houses, windmills and bougainvillea streets.',
    description: [
      'Alaçatı is one of the most photogenic towns on the Aegean coast. Its narrow stone streets, blue shutters and colourful doors make it perfect for romantic couple sessions and surprise proposals.',
      'The town gets busy in summer afternoons, so we usually shoot early in the morning or during the golden hour before sunset for soft light and quiet streets.',
    ],
    bestTime: 'Early morning or one hour before sunset',
    spots: ['The windmills on the hill', 'Kemalpaşa Street', 'Hidden courtyards of the old town', 'Alaçatı marina at sunset'],
  },
  {
    slug: 'cesme',
    name: 'Çeşme',
    cover: places.cesme,
    blurb: 'Turquoise bays, beaches and boat proposals.',
    description: [
      'Çeşme is known for its crystal-clear water and long sandy beaches. It is the dream setting for a beach proposal or a sunset boat shoot.',
    ],
    bestTime: 'Sunset, May to October',
    spots: ['Ilıca Beach', 'Çeşme Castle', 'Private boat tour', 'Aya Yorgi Bay'],
  },
  {
    slug: 'urla',
    name: 'Urla',
    cover: places.urla,
    blurb: 'Vineyards, olive groves and countryside elegance.',
    description: [
      'Urla’s vineyards and stone wineries are a favourite for intimate weddings and elegant couple sessions surrounded by nature.',
    ],
    bestTime: 'Golden hour, spring and autumn',
    spots: ['Urla vineyard route', 'Olive groves', 'Old town streets'],
  },
  {
    slug: 'sirince',
    name: 'Şirince',
    cover: places.sirince,
    blurb: 'A hillside village near Ephesus, full of character.',
    description: [
      'Şirince is a charming mountain village with whitewashed houses, cobbled lanes and views over the valley. It pairs perfectly with a visit to Ephesus.',
    ],
    bestTime: 'Morning, before the day visitors arrive',
    spots: ['Village lanes', 'Church of St. John the Baptist', 'Valley viewpoints'],
  },
  {
    slug: 'kordon',
    name: 'Kordon & Izmir City',
    cover: places.kordon,
    blurb: 'Seafront promenade and sunsets over the bay.',
    description: [
      'The Kordon promenade is Izmir’s seafront heart. Long sunsets over the bay, palm trees and the historic clock tower nearby make for a classic city session.',
    ],
    bestTime: 'Sunset all year round',
    spots: ['Kordon promenade', 'Konak Clock Tower', 'Kemeraltı Bazaar', 'Asansör viewpoint'],
  },
];

export const faqs = [
  {
    q: 'Do you speak English?',
    a: 'Yes. All communication, planning and the shoot itself can be in English. (Other languages: to be confirmed.)',
  },
  {
    q: 'Do you travel outside Izmir city?',
    a: 'Absolutely. I regularly shoot in Alaçatı, Çeşme, Urla, Şirince and Ephesus. Travel within the Izmir region is included in most packages.',
  },
  {
    q: 'Can you help me plan a surprise proposal?',
    a: 'Yes, that is my favourite part. We will choose the spot and the timing together, and I will stay hidden until the moment. I can also recommend decorators and restaurants.',
  },
  {
    q: 'When will we receive our photos?',
    a: 'You will get a sneak peek within 48 hours and your full, edited gallery within 1–3 weeks depending on the session.',
  },
  {
    q: 'How do we book?',
    a: 'Send a message on WhatsApp or through the contact form with your date and location. A deposit secures your date.',
  },
];

// Placeholder reviews. Replace with real client reviews before going live.
export const testimonials = [
  { quote: 'Real client review will go here. A few sentences about how the shoot felt and how the photos turned out.', name: 'Client name', from: 'Country' },
  { quote: 'Second real review. Mentioning the location and the type of shoot helps both trust and Google.', name: 'Client name', from: 'Country' },
  { quote: 'Third real review. Ideally the same reviews also appear on the Google Business Profile.', name: 'Client name', from: 'Country' },
];
