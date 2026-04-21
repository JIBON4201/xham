"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Eye, Clock, Sparkles, TrendingUp, Film } from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   AI GALLERY SECTION
   Grid of AI-generated cinematic visual cards.
   Each card click triggers the ad monetization smartlink funnel.

   Props:
   - onCardClick: callback when a gallery card is clicked
   ════════════════════════════════════════════════════════════════ */

interface AiGalleryCard {
  id: string;
  title: string;
  tag: string;
  image: string;
  duration: string;
  views: string;
  icon: typeof Sparkles;
}

const GALLERY_CARDS: AiGalleryCard[] = [
  {
    id: "scene-01",
    title: "Neon Metropolis",
    tag: "AI Preview",
    image: "/ai-gallery/scene-01.png",
    duration: "2:34",
    views: "14.2K",
    icon: Sparkles,
  },
  {
    id: "scene-02",
    title: "Cosmic Nebula",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-02.png",
    duration: "3:18",
    views: "22.8K",
    icon: TrendingUp,
  },
  {
    id: "scene-03",
    title: "Deep Ocean Dreams",
    tag: "AI Preview",
    image: "/ai-gallery/scene-03.png",
    duration: "1:52",
    views: "9.7K",
    icon: Sparkles,
  },
  {
    id: "scene-04",
    title: "Liquid Chrome",
    tag: "Trending Visual",
    image: "/ai-gallery/scene-04.png",
    duration: "2:07",
    views: "18.3K",
    icon: TrendingUp,
  },
  {
    id: "scene-05",
    title: "Frozen Aurora",
    tag: "AI Preview",
    image: "/ai-gallery/scene-05.png",
    duration: "4:11",
    views: "31.5K",
    icon: Sparkles,
  },
  {
    id: "scene-06",
    title: "Holographic Fractals",
    tag: "Featured Preview",
    image: "/ai-gallery/scene-06.png",
    duration: "2:45",
    views: "16.9K",
    icon: Film,
  },
];

interface AiGallerySectionProps {
  onCardClick: (cardId: string) => void;
}

export function AiGallerySection({ onCardClick }: AiGallerySectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleCardClick = useCallback(
    (cardId: string) => {
      onCardClick(cardId);
    },
    [onCardClick]
  );

  return (
    <section className="py-20 sm:py-28" id="ai-gallery" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-rose-400" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-widest text-rose-400">
                AI-Generated Gallery
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
              Explore our curated collection of AI-generated cinematic scenes.
              Click any card to preview the full experience.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
            <span>Click to preview</span>
          </div>
        </motion.div>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_CARDS.map((card, i) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
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
                    <Play className="h-6 w-6 fill-white text-white ml-0.5" aria-hidden="true" />
                  </div>
                </div>

                {/* Tag badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                  <card.icon className="h-3 w-3 text-rose-400" aria-hidden="true" />
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
                    AI Generated Scene
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
            All visuals are AI-generated artistic content. No real individuals depicted.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
