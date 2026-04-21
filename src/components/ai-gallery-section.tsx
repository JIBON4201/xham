"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, Eye, Clock, Sparkles, TrendingUp, Film, Flame, Crown, Zap, ChevronDown } from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   AI GALLERY SECTION
   Grid of AI-generated cinematic visual cards.
   Each card click triggers the ad monetization smartlink funnel.

   Props:
   - onCardClick: callback when a gallery card is clicked
   ════════════════════════════════════════════════════════════════ */

type IconType = typeof Sparkles;

interface AiGalleryCard {
  id: string;
  title: string;
  tag: string;
  image: string;
  duration: string;
  views: string;
  icon: IconType;
  category: string;
}

const GALLERY_CARDS: AiGalleryCard[] = [
  // ── Original 6 cards ──
  {
    id: "scene-01",
    title: "Neon Metropolis",
    tag: "AI Preview",
    image: "/ai-gallery/scene-01.png",
    duration: "2:34",
    views: "14.2K",
    icon: Sparkles,
    category: "all",
  },
  {
    id: "scene-02",
    title: "Cosmic Nebula",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-02.png",
    duration: "3:18",
    views: "22.8K",
    icon: TrendingUp,
    category: "all",
  },
  {
    id: "scene-03",
    title: "Deep Ocean Dreams",
    tag: "AI Preview",
    image: "/ai-gallery/scene-03.png",
    duration: "1:52",
    views: "9.7K",
    icon: Sparkles,
    category: "all",
  },
  {
    id: "scene-04",
    title: "Liquid Chrome",
    tag: "Trending Visual",
    image: "/ai-gallery/scene-04.png",
    duration: "2:07",
    views: "18.3K",
    icon: TrendingUp,
    category: "all",
  },
  {
    id: "scene-05",
    title: "Frozen Aurora",
    tag: "AI Preview",
    image: "/ai-gallery/scene-05.png",
    duration: "4:11",
    views: "31.5K",
    icon: Sparkles,
    category: "all",
  },
  {
    id: "scene-06",
    title: "Holographic Fractals",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-06.png",
    duration: "2:45",
    views: "16.9K",
    icon: Film,
    category: "all",
  },

  // ── New cards 7–26 ──
  {
    id: "scene-07",
    title: "Bioluminescent Caves",
    tag: "AI Preview",
    image: "/ai-gallery/scene-07.png",
    duration: "3:42",
    views: "27.1K",
    icon: Sparkles,
    category: "nature",
  },
  {
    id: "scene-08",
    title: "Cyberpunk Rain",
    tag: "Trending Visual",
    image: "/ai-gallery/scene-08.png",
    duration: "2:58",
    views: "35.6K",
    icon: Flame,
    category: "scifi",
  },
  {
    id: "scene-09",
    title: "Volcanic Fury",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-09.png",
    duration: "4:22",
    views: "41.3K",
    icon: Crown,
    category: "nature",
  },
  {
    id: "scene-10",
    title: "Abyssal Glow",
    tag: "AI Preview",
    image: "/ai-gallery/scene-10.png",
    duration: "3:15",
    views: "19.8K",
    icon: Sparkles,
    category: "nature",
  },
  {
    id: "scene-11",
    title: "Crystal Desert",
    tag: "Trending Visual",
    image: "/ai-gallery/scene-11.png",
    duration: "5:03",
    views: "28.4K",
    icon: TrendingUp,
    category: "scifi",
  },
  {
    id: "scene-12",
    title: "Enchanted Ruins",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-12.png",
    duration: "3:37",
    views: "33.2K",
    icon: Crown,
    category: "fantasy",
  },
  {
    id: "scene-13",
    title: "Crimson Dynamics",
    tag: "AI Preview",
    image: "/ai-gallery/scene-13.png",
    duration: "2:19",
    views: "15.6K",
    icon: Sparkles,
    category: "abstract",
  },
  {
    id: "scene-14",
    title: "Polar Aurora",
    tag: "Trending Visual",
    image: "/ai-gallery/scene-14.png",
    duration: "4:55",
    views: "44.7K",
    icon: Flame,
    category: "nature",
  },
  {
    id: "scene-15",
    title: "Clockwork Metropolis",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-15.png",
    duration: "3:28",
    views: "21.9K",
    icon: Film,
    category: "scifi",
  },
  {
    id: "scene-16",
    title: "Fractal Dimensions",
    tag: "AI Preview",
    image: "/ai-gallery/scene-16.png",
    duration: "2:44",
    views: "17.5K",
    icon: Sparkles,
    category: "abstract",
  },
  {
    id: "scene-17",
    title: "Arcane Library",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-17.png",
    duration: "3:51",
    views: "38.1K",
    icon: Crown,
    category: "fantasy",
  },
  {
    id: "scene-18",
    title: "Galactic Collision",
    tag: "Trending Visual",
    image: "/ai-gallery/scene-18.png",
    duration: "5:17",
    views: "52.3K",
    icon: Flame,
    category: "scifi",
  },
  {
    id: "scene-19",
    title: "Derelict Station",
    tag: "AI Preview",
    image: "/ai-gallery/scene-19.png",
    duration: "2:33",
    views: "23.7K",
    icon: Sparkles,
    category: "scifi",
  },
  {
    id: "scene-20",
    title: "Neon Velocity",
    tag: "Trending Visual",
    image: "/ai-gallery/scene-20.png",
    duration: "1:48",
    views: "29.4K",
    icon: Zap,
    category: "abstract",
  },
  {
    id: "scene-21",
    title: "World Tree",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-21.png",
    duration: "4:09",
    views: "36.8K",
    icon: Crown,
    category: "fantasy",
  },
  {
    id: "scene-22",
    title: "Chrome Reflections",
    tag: "AI Preview",
    image: "/ai-gallery/scene-22.png",
    duration: "2:56",
    views: "20.2K",
    icon: Sparkles,
    category: "abstract",
  },
  {
    id: "scene-23",
    title: "Amethyst Depths",
    tag: "Trending Visual",
    image: "/ai-gallery/scene-23.png",
    duration: "3:33",
    views: "25.9K",
    icon: TrendingUp,
    category: "nature",
  },
  {
    id: "scene-24",
    title: "Twilight Megacity",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-24.png",
    duration: "4:41",
    views: "47.6K",
    icon: Flame,
    category: "scifi",
  },
  {
    id: "scene-25",
    title: "Psychedelic Drift",
    tag: "AI Preview",
    image: "/ai-gallery/scene-25.png",
    duration: "2:12",
    views: "18.7K",
    icon: Sparkles,
    category: "abstract",
  },
  {
    id: "scene-26",
    title: "Moonlit Garden",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-26.png",
    duration: "3:26",
    views: "32.4K",
    icon: Crown,
    category: "nature",
  },
];

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "nature", label: "Nature" },
  { key: "scifi", label: "Sci-Fi" },
  { key: "fantasy", label: "Fantasy" },
  { key: "abstract", label: "Abstract" },
] as const;

const CARDS_PER_PAGE = 8;

interface AiGallerySectionProps {
  onCardClick: (cardId: string) => void;
}

export function AiGallerySection({ onCardClick }: AiGallerySectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);

  const filteredCards =
    activeCategory === "all"
      ? GALLERY_CARDS
      : GALLERY_CARDS.filter((c) => c.category === activeCategory);

  const visibleCards = filteredCards.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCards.length;

  const handleCardClick = useCallback(
    (cardId: string) => {
      onCardClick(cardId);
    },
    [onCardClick]
  );

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(CARDS_PER_PAGE);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + CARDS_PER_PAGE);
  }, []);

  // Determine a descriptive label for each card
  const getCardTypeLabel = (card: AiGalleryCard): string => {
    if (card.category === 'nature') return 'AI Visual';
    if (card.category === 'scifi') return 'Trending Clip';
    if (card.category === 'fantasy') return 'Preview Scene';
    return 'AI Visual';
  };

  return (
    <section
      className="py-12 sm:py-20"
      id="ai-gallery"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles
                className="h-4 w-4 text-rose-400"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-rose-400">
                Preview Gallery
              </span>
            </div>
            <h2
              id="gallery-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Trending{" "}
              <span className="text-gradient">AI Visuals</span>
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Browse AI-generated images and short cinematic clips. Click any card to preview.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
            <span>{GALLERY_CARDS.length}+ AI visuals available</span>
          </div>
        </motion.div>

        {/* Category filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter gallery by category"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              role="tab"
              aria-selected={activeCategory === cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
                activeCategory === cat.key
                  ? "border-rose-500/50 bg-rose-500/15 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                  : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/20 hover:bg-white/[0.06] hover:text-foreground"
              }`}
            >
              {cat.label}
              {cat.key !== "all" && (
                <span className="ml-1.5 opacity-50">
                  ({GALLERY_CARDS.filter((c) => c.category === cat.key).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleCards.map((card, i) => (
              <motion.article
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleCardClick(card.id)}
                className="ai-gallery-card group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-500 hover:border-rose-500/40"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(card.id);
                  }
                }}
                aria-label={`Preview ${card.title} — ${card.tag}`}
              >
                {/* Image container */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={card.image}
                    alt={`${card.title} — AI-generated cinematic visual preview`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Soft blur overlay for aesthetic */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Hover glow effect */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(244,63,94,0.15) 0%, transparent 70%)",
                    }}
                    aria-hidden="true"
                  />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 scale-75">
                      <Play
                        className="h-6 w-6 fill-white text-white ml-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Tag badge */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                    <card.icon
                      className="h-3 w-3 text-rose-400"
                      aria-hidden="true"
                    />
                    {card.tag}
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-sm">
                    <Clock className="h-2.5 w-2.5" aria-hidden="true" />
                    {card.duration}
                  </div>
                </div>

                {/* Card info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold tracking-tight transition-colors duration-300 group-hover:text-rose-400">
                    {card.title}
                  </h3>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {getCardTypeLabel(card)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                      <Eye className="h-3 w-3" aria-hidden="true" />
                      {card.views}
                    </span>
                  </div>
                </div>

                {/* Bottom hover glow line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(244,63,94,0.5), rgba(139,92,246,0.5), transparent)",
                  }}
                  aria-hidden="true"
                />
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation clarity — scroll hint + Load More */}
        <div className="mt-10 flex flex-col items-center gap-4">
          {/* Scroll hint text */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <ChevronDown className="h-3.5 w-3.5 animate-bounce" aria-hidden="true" />
            <span>Scroll to view more AI content &bull; {GALLERY_CARDS.length}+ visuals available</span>
          </div>

          {/* Load More button */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={handleLoadMore}
                className="group relative overflow-hidden rounded-full border border-white/10 bg-white/[0.03] px-8 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-rose-500/40 hover:text-rose-400"
              >
                <span className="relative z-10">
                  Load More — {filteredCards.length - visibleCount} remaining
                </span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-rose-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-xs text-muted-foreground/50">
            All visuals are AI-generated artistic content. No real individuals
            depicted.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
