/* ════════════════════════════════════════════════════════════════
   STATIC GALLERY DATA
   This is the fallback data used when the database is not available
   (e.g., on Vercel serverless where SQLite doesn't work).
   
   On localhost with SQLite: API routes use Prisma → DB is source of truth
   On Vercel: Components use this static data → always works
   ════════════════════════════════════════════════════════════════ */

export interface StaticGalleryCard {
  id: string;
  sceneId: string;
  title: string;
  tag: string;
  image: string;
  duration: string;
  views: string;
  icon: string;
  category: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const STATIC_CARDS: StaticGalleryCard[] = [
  { id: "static-01", sceneId: "scene-01", title: "Neon Metropolis", tag: "AI Preview", image: "/ai-gallery/scene-01.webp", duration: "2:34", views: "14.2K", icon: "Sparkles", category: "all", order: 1, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-02", sceneId: "scene-02", title: "Cosmic Nebula", tag: "Featured Preview", image: "/ai-gallery/scene-02.jpg", duration: "3:18", views: "22.8K", icon: "TrendingUp", category: "all", order: 2, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-03", sceneId: "scene-03", title: "Deep Ocean Dreams", tag: "AI Preview", image: "/ai-gallery/scene-03.jpg", duration: "1:52", views: "9.7K", icon: "Sparkles", category: "all", order: 3, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-04", sceneId: "scene-04", title: "Liquid Chrome", tag: "Trending Visual", image: "/ai-gallery/scene-04.jpeg", duration: "2:07", views: "18.3K", icon: "TrendingUp", category: "all", order: 4, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-05", sceneId: "scene-05", title: "Frozen Aurora", tag: "AI Preview", image: "/ai-gallery/scene-05.png", duration: "4:11", views: "31.5K", icon: "Sparkles", category: "all", order: 5, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-06", sceneId: "scene-06", title: "Holographic Fractals", tag: "Featured Preview", image: "/ai-gallery/scene-06.jpg", duration: "2:45", views: "16.9K", icon: "Film", category: "all", order: 6, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-07", sceneId: "scene-07", title: "Bioluminescent Caves", tag: "AI Preview", image: "/ai-gallery/scene-07.webp", duration: "3:42", views: "27.1K", icon: "Sparkles", category: "nature", order: 7, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-08", sceneId: "scene-08", title: "Cyberpunk Rain", tag: "Trending Visual", image: "/ai-gallery/scene-08.webp", duration: "2:58", views: "35.6K", icon: "Flame", category: "scifi", order: 8, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-09", sceneId: "scene-09", title: "Volcanic Fury", tag: "Featured Preview", image: "/ai-gallery/scene-09.jpg", duration: "4:22", views: "41.3K", icon: "Crown", category: "nature", order: 9, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-10", sceneId: "scene-10", title: "Abyssal Glow", tag: "AI Preview", image: "/ai-gallery/scene-10.jpeg", duration: "3:15", views: "19.8K", icon: "Sparkles", category: "nature", order: 10, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-11", sceneId: "scene-11", title: "Crystal Desert", tag: "Trending Visual", image: "/ai-gallery/scene-11.jpg", duration: "5:03", views: "28.4K", icon: "TrendingUp", category: "scifi", order: 11, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-12", sceneId: "scene-12", title: "Enchanted Ruins", tag: "Featured Preview", image: "/ai-gallery/scene-12.webp", duration: "3:37", views: "33.2K", icon: "Crown", category: "fantasy", order: 12, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-13", sceneId: "scene-13", title: "Crimson Dynamics", tag: "AI Preview", image: "/ai-gallery/scene-13.webp", duration: "2:19", views: "15.6K", icon: "Sparkles", category: "abstract", order: 13, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-14", sceneId: "scene-14", title: "Polar Aurora", tag: "Trending Visual", image: "/ai-gallery/scene-14.jpg", duration: "4:55", views: "44.7K", icon: "Flame", category: "nature", order: 14, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-15", sceneId: "scene-15", title: "Clockwork Metropolis", tag: "Featured Preview", image: "/ai-gallery/scene-15.jpg", duration: "3:28", views: "21.9K", icon: "Film", category: "scifi", order: 15, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-16", sceneId: "scene-16", title: "Fractal Dimensions", tag: "AI Preview", image: "/ai-gallery/scene-16.jpg", duration: "2:44", views: "17.5K", icon: "Sparkles", category: "abstract", order: 16, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-17", sceneId: "scene-17", title: "Arcane Library", tag: "Featured Preview", image: "/ai-gallery/scene-17.jpg", duration: "3:51", views: "38.1K", icon: "Crown", category: "fantasy", order: 17, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-18", sceneId: "scene-18", title: "Galactic Collision", tag: "Trending Visual", image: "/ai-gallery/scene-18.jpg", duration: "5:17", views: "52.3K", icon: "Flame", category: "scifi", order: 18, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-19", sceneId: "scene-19", title: "Derelict Station", tag: "AI Preview", image: "/ai-gallery/scene-19.jpg", duration: "2:33", views: "23.7K", icon: "Sparkles", category: "scifi", order: 19, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-20", sceneId: "scene-20", title: "Neon Velocity", tag: "Trending Visual", image: "/ai-gallery/scene-20.jpg", duration: "1:48", views: "29.4K", icon: "Zap", category: "abstract", order: 20, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-21", sceneId: "scene-21", title: "World Tree", tag: "Featured Preview", image: "/ai-gallery/scene-21.jpg", duration: "4:09", views: "36.8K", icon: "Crown", category: "fantasy", order: 21, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-22", sceneId: "scene-22", title: "Chrome Reflections", tag: "AI Preview", image: "/ai-gallery/scene-22.webp", duration: "2:56", views: "20.2K", icon: "Sparkles", category: "abstract", order: 22, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-23", sceneId: "scene-23", title: "Amethyst Depths", tag: "Trending Visual", image: "/ai-gallery/scene-23.jpg", duration: "3:33", views: "25.9K", icon: "TrendingUp", category: "nature", order: 23, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-24", sceneId: "scene-24", title: "Twilight Megacity", tag: "Featured Preview", image: "/ai-gallery/scene-24.jpg", duration: "4:41", views: "47.6K", icon: "Flame", category: "scifi", order: 24, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-25", sceneId: "scene-25", title: "Psychedelic Drift", tag: "AI Preview", image: "/ai-gallery/scene-25.jpg", duration: "2:12", views: "18.7K", icon: "Sparkles", category: "abstract", order: 25, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-26", sceneId: "scene-26", title: "Moonlit Garden", tag: "Featured Preview", image: "/ai-gallery/scene-26.jpg", duration: "3:26", views: "32.4K", icon: "Crown", category: "nature", order: 26, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-27", sceneId: "scene-27", title: "Silken Dreamscape", tag: "AI Preview", image: "/ai-gallery/scene-27.png", duration: "2:48", views: "19.3K", icon: "Sparkles", category: "fantasy", order: 27, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
  { id: "static-28", sceneId: "scene-28", title: "Velvet Horizon", tag: "Trending Visual", image: "/ai-gallery/scene-28.png", duration: "3:14", views: "26.7K", icon: "Flame", category: "scifi", order: 28, active: true, createdAt: "2026-04-21T00:00:00.000Z", updatedAt: "2026-04-21T00:00:00.000Z" },
];

/** Get all static cards (only active ones by default) */
export function getStaticCards(activeOnly = true): StaticGalleryCard[] {
  const cards = activeOnly
    ? STATIC_CARDS.filter((c) => c.active)
    : STATIC_CARDS;
  return cards.sort((a, b) => a.order - b.order);
}

/** Get all static cards including inactive (for admin) */
export function getStaticCardsAll(): StaticGalleryCard[] {
  return STATIC_CARDS.sort((a, b) => a.order - b.order);
}

export default STATIC_CARDS;
