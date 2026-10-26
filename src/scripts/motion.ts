// Site-wide motion: smooth scroll, intro, text and image reveals, parallax.
// Everything is skipped for visitors who prefer reduced motion.
// Only transform and opacity are animated, so the browser can run them on the
// GPU without repainting the page each frame.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduced =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches && !(window as any).__forceMotion;
const ease = 'expo.out';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function showAll() {
  root.classList.remove('motion');
  document.querySelector('.intro-screen')?.remove();
}

// --- Smooth scroll ---------------------------------------------------------
let lenis: Lenis | undefined;

function initSmoothScroll() {
  lenis = new Lenis({ duration: 1.15, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // The lightbox locks scrolling while it is open
  document.addEventListener('lightbox:open', () => lenis?.stop());
  document.addEventListener('lightbox:close', () => lenis?.start());
}

// --- Header: hide when scrolling down, show when scrolling up ---------------
function initHeader() {
  const header = document.querySelector<HTMLElement>('.header');
  if (!header) return;
  let last = 0;
  ScrollTrigger.create({
    onUpdate: (self) => {
      const y = self.scroll();
      const hide = y > 400 && y > last && !header.classList.contains('is-open');
      header.classList.toggle('is-hidden', hide);
      last = y;
    },
  });
}

// --- Intro screen (first visit of the session only) -------------------------
function playIntro(): gsap.core.Timeline {
  const tl = gsap.timeline();
  const screen = document.querySelector<HTMLElement>('.intro-screen');
  if (!screen) return tl;

  let seen = false;
  try {
    seen = sessionStorage.getItem('intro-seen') === '1';
    sessionStorage.setItem('intro-seen', '1');
  } catch {}

  if (seen) {
    screen.remove();
    return tl;
  }

  screen.hidden = false;
  const letters = new SplitText(screen.querySelector('.intro-screen__name'), { type: 'chars', mask: 'chars' });
  tl.from(letters.chars, { yPercent: 110, duration: 1, stagger: 0.035, ease })
    .from('.intro-screen__line', { scaleX: 0, duration: 0.9, ease: 'power3.inOut' }, '-=0.6')
    .from('.intro-screen__sub', { autoAlpha: 0, y: 10, duration: 0.6 }, '-=0.4')
    .to(screen, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=0.25')
    .add(() => screen.remove());
  return tl;
}

// --- Hero ------------------------------------------------------------------
function heroTimeline(): gsap.core.Timeline {
  const tl = gsap.timeline();
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return tl;

  const img = hero.querySelector('[data-hero-img]');
  const title = hero.querySelector('h1');
  const split = title ? new SplitText(title, { type: 'lines', mask: 'lines', linesClass: 'line' }) : null;

  tl.set(hero, { autoAlpha: 1 })
    .fromTo(img, { scale: 1.15, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.2, ease })
    .from(split?.lines ?? [], { yPercent: 105, duration: 1.3, stagger: 0.12, ease }, 0.3)
    .from(hero.querySelectorAll('[data-hero-fade]'), { autoAlpha: 0, y: 20, duration: 1, stagger: 0.1, ease }, 0.6)
    // Animate the inner bar: the header itself uses a CSS transform to hide on scroll
    .fromTo('.header__inner', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, clearProps: 'all' }, 0.6);

  // Slow parallax as the hero scrolls away
  gsap.to(img, {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to(hero.querySelector('.hero__content'), {
    yPercent: -30,
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: '80% top', scrub: true },
  });
  return tl;
}

// --- Scroll reveals -----------------------------------------------------------
function initReveals() {
  // Headings rise line by line out of a mask
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'line' });
    gsap.set(el, { autoAlpha: 1 });
    gsap.from(split.lines, {
      yPercent: 105,
      duration: 1.2,
      stagger: 0.1,
      ease,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // Images: a cover (CSS ::after, scaled through --cover) slides away while the photo settles
  document.querySelectorAll<HTMLElement>('[data-reveal-img]').forEach((wrap) => {
    const img = wrap.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: wrap, start: 'top 88%' } });
    tl.to(wrap, { '--cover': 0, duration: 1.3, ease: 'expo.inOut' }).fromTo(
      img,
      { scale: 1.2 },
      // clearProps hands the transform back to CSS so hover zooms keep working
      { scale: 1, duration: 1.8, ease, clearProps: 'transform' },
      0.1,
    );
  });

  // Generic fade-up blocks
  ScrollTrigger.batch('.reveal', {
    start: 'top 90%',
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12, ease, overwrite: true }),
  });

  // Gallery photos appear in a gentle cascade
  ScrollTrigger.batch('.masonry figure', {
    start: 'top 92%',
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08, ease, overwrite: true }),
  });

  // Subtle parallax inside framed images
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax) || 10;
    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // Portfolio filter changes the layout: fade the remaining photos back in
  document.addEventListener('gallery:filter', () => {
    const visible = [...document.querySelectorAll<HTMLElement>('.masonry figure')].filter((f) => !f.hidden);
    gsap.fromTo(visible, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05, ease, overwrite: true });
    ScrollTrigger.refresh();
  });
}

// --- Boot ------------------------------------------------------------------
async function boot() {
  (window as any).__motion = true;
  if (reduced) {
    showAll();
    return;
  }
  initSmoothScroll();
  initHeader();

  // Text is split once the fonts are in (so line breaks are right) and the hero
  // photo is decoded (so it doesn't stutter while animating), but never wait
  // longer than a moment for either.
  const heroImg = document.querySelector<HTMLImageElement>('[data-hero-img]');
  await Promise.race([Promise.all([document.fonts.ready, heroImg?.decode().catch(() => {})]), wait(600)]);

  initReveals();
  const intro = playIntro();
  const master = gsap.timeline();
  master.add(intro);
  master.add(heroTimeline(), intro.duration() ? '-=0.6' : 0);
}

boot();
