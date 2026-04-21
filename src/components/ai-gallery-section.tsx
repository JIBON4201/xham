"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, Eye, Clock, Sparkles, TrendingUp, Film, Flame, Crown, Zap, ChevronDown, RefreshCw } from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   AI GALLERY SECTION
   Grid of AI-generated cinematic visual cards.
   Each card click triggers the ad monetization smartlink funnel.

   Props:
   - onCardClick: callback when a gallery card is clicked
   ════════════════════════════════════════════════════════════════ */

type IconType = typeof Sparkles;

interface GalleryCardData {
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
  updatedAt: string;
}

// Map icon name string to Lucide component
const ICON_MAP: Record<string, IconType> = {
  Sparkles,
  TrendingUp,
  Film,
  Flame,
  Crown,
  Zap,
};

function getIconComponent(iconName: string): IconType {
  return ICON_MAP[iconName] || Sparkles;
}

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "nature", label: "Nature" },
  { key: "scifi", label: "Sci-Fi" },
  { key: "fantasy", label: "Fantasy" },
  { key: "abstract", label: "Abstract" },
] as const;

const CARDS_PER_PAGE = 8;

interface AiGallerySectionProps {
  onCardClick: (card: { sceneId: string; title: string; image: string; tag: string; duration: string; views: string }) => void;
}

export function AiGallerySection({ onCardClick }: AiGallerySectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
  const [cards, setCards] = useState<GalleryCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cards from database
  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          setCards(data);
        }
      } catch (err) {
        console.error("Failed to fetch gallery cards:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  const filteredCards = useMemo(
    () =>
      activeCategory === "all"
        ? cards
        : cards.filter((c) => c.category === activeCategory),
    [cards, activeCategory]
  );

  const visibleCards = filteredCards.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCards.length;

  const handleCardClick = useCallback(
    (card: { sceneId: string; title: string; image: string; tag: string; duration: string; views: string }) => {
      onCardClick(card);
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

  const getCardTypeLabel = (card: GalleryCardData): string => {
    if (card.category === "nature") return "AI Visual";
    if (card.category === "scifi") return "Trending Clip";
    if (card.category === "fantasy") return "Preview Scene";
    return "AI Visual";
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-20" id="ai-gallery" aria-labelledby="gallery-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="mt-3 text-sm text-muted-foreground">Loading gallery...</span>
          </div>
        </div>
      </section>
    );
  }

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
            <span>{cards.length}+ AI visuals available</span>
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
                  ({cards.filter((c) => c.category === cat.key).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleCards.map((card, i) => {
              const IconComponent = getIconComponent(card.icon);
              return (
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
                  onClick={() => handleCardClick({ sceneId: card.sceneId, title: card.title, image: card.image, tag: card.tag, duration: card.duration, views: card.views })}
                  className="ai-gallery-card group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-500 hover:border-rose-500/40"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardClick({ sceneId: card.sceneId, title: card.title, image: card.image, tag: card.tag, duration: card.duration, views: card.views });
                    }
                  }}
                  aria-label={`Preview ${card.title} — ${card.tag}`}
                >
                  {/* Image container */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      key={card.id + '-' + card.updatedAt}
                      src={card.image}
                      alt={`${card.title} — AI-generated cinematic visual preview`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
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
                      <IconComponent
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
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation clarity — scroll hint + Load More */}
        <div className="mt-10 flex flex-col items-center gap-4">
          {/* Scroll hint text */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <ChevronDown className="h-3.5 w-3.5 animate-bounce" aria-hidden="true" />
            <span>Scroll to view more AI content &bull; {cards.length}+ visuals available</span>
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
