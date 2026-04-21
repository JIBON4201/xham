"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { X, ExternalLink, Shield, Play, Star, Zap, Clock } from "lucide-react";
import { AD_CONFIG } from "@/lib/ad-config";

/* ════════════════════════════════════════════════════════════════
   AD SYSTEM — ALL SLOTS ARE WORKING SMARTLINK UNITS
   Every ad slot renders a clickable banner that opens a
   smartlink (Adsterra or HilltopAds) in a new tab.
   50/50 rotation between networks for maximum revenue.
   ════════════════════════════════════════════════════════════════ */

/* ── Smartlink helper ── */
function getRandomSmartlink(): string {
  const useHilltop = Math.random() < 0.5;
  return useHilltop
    ? AD_CONFIG.hilltopAds.smartlinkUrl
    : AD_CONFIG.adsterra.smartlinkUrl;
}

/* ── Ad copy variations (rotated per slot to avoid blindness) ── */
const AD_COPY: Record<string, { headline: string; sub: string; cta: string }[]> = {
  leaderboard: [
    { headline: "🔒 Access 50,000+ Premium Private Videos — Free", sub: "No signup. No credit card. Instant HD streaming.", cta: "Watch Free Now" },
    { headline: "🔥 Trending: New Exclusive Content Added Daily", sub: "Military-grade encryption. Zero tracking.", cta: "Browse Now" },
    { headline: "⚡ Instant 4K Streaming — No Account Needed", sub: "2.4M+ active viewers worldwide", cta: "Start Watching" },
    { headline: "🆓 Free Premium Access — Limited Time Offer", sub: "AES-256 encrypted. Zero-logging policy.", cta: "Claim Access" },
  ],
  native: [
    { headline: "Recommended for You: Exclusive HD Content", sub: "Private & secure — no account required", cta: "Watch Now" },
    { headline: "Editor's Pick: Most Watched This Week", sub: "4K Ultra HD • VPN Friendly • No Tracking", cta: "Play Now" },
    { headline: "Trending: Top Premium Videos Right Now", sub: "50,000+ exclusive titles • Updated daily", cta: "View All" },
  ],
  rectangle: [
    { headline: "🔥 Hot Now", sub: "Exclusive content just added", cta: "Watch" },
    { headline: "⭐ Editor's Pick", sub: "Most viewed today", cta: "Play" },
    { headline: "🆕 Just Released", sub: "Premium HD quality", cta: "View" },
  ],
  mobile: [
    { headline: "Free Premium Videos", sub: "No signup", cta: "Watch" },
    { headline: "New Content Added", sub: "Updated daily", cta: "Play" },
  ],
  popup: [
    { headline: " ad — Continue to full content", sub: "Opens in new tab", cta: "" },
  ],
};

function getRandomCopy(type: string) {
  const pool = AD_COPY[type] || AD_COPY.leaderboard;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ════════════════════════════════════════════════════════════════
   BASE AD SLOT — Lazy-loaded, clickable smartlink unit
   ════════════════════════════════════════════════════════════════ */

interface AdSlotProps {
  id: string;
  slot?: string;
  size?: "leaderboard" | "banner" | "rectangle" | "skyscraper" | "mobile-banner" | "native" | "fluid" | "popup-banner";
  className?: string;
  label?: string;
  dismissible?: boolean;
  sticky?: "bottom" | "top" | false;
  /** Use this specific smartlink URL instead of random rotation */
  forceUrl?: string;
}

const sizeMap: Record<string, { w: string; h: string }> = {
  leaderboard: { w: "728px", h: "90px" },
  banner: { w: "468px", h: "60px" },
  rectangle: { w: "300px", h: "250px" },
  skyscraper: { w: "160px", h: "600px" },
  "mobile-banner": { w: "100%", h: "50px" },
  native: { w: "100%", h: "130px" },
  fluid: { w: "100%", h: "auto" },
  "popup-banner": { w: "100%", h: "60px" },
};

export function AdSlot({
  id,
  slot,
  size = "rectangle",
  className,
  dismissible = false,
  sticky = false,
  forceUrl,
}: AdSlotProps) {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const dim = sizeMap[size] || sizeMap.rectangle;
  const clickCountRef = useRef(0);

  // Lazy-load with IntersectionObserver
  useEffect(() => {
    const el = document.getElementById(`ad-slot-${id}`);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  const handleClick = useCallback(() => {
    clickCountRef.current += 1;
    const url = forceUrl || getRandomSmartlink();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, [forceUrl]);

  if (dismissed) return null;

  // Determine copy type based on size
  const copyType =
    size === "native" ? "native" :
    size === "rectangle" ? "rectangle" :
    size === "mobile-banner" ? "mobile" :
    size === "popup-banner" ? "popup" :
    "leaderboard";
  const copy = getRandomCopy(copyType);

  return (
    <div
      id={`ad-slot-${id}`}
      className={cn(
        "ad-slot relative mx-auto overflow-hidden rounded-lg",
        sticky === "bottom" && "fixed bottom-0 left-0 right-0 z-40 rounded-none border-0",
        sticky === "top" && "fixed top-16 left-0 right-0 z-40 rounded-none",
        className
      )}
      style={
        sticky
          ? undefined
          : { minHeight: dim.h, maxWidth: dim.w, width: dim.w === "100%" ? "100%" : undefined }
      }
      data-ad-slot={slot || id}
      data-ad-size={size}
      role="complementary"
      aria-label="Advertisement"
    >
      {dismissible && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          className="absolute top-1 right-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white/60 hover:bg-black/70 hover:text-white transition-colors"
          aria-label="Dismiss advertisement"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {!visible ? (
        /* Skeleton while loading */
        <div
          className="flex items-center justify-center bg-white/[0.02] animate-pulse"
          style={{ minHeight: dim.h }}
        />
      ) : (
        /* ── Clickable ad unit ── */
        <a
          href={forceUrl || getRandomSmartlink()}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
          className={cn(
            "group/ad block w-full cursor-pointer overflow-hidden transition-all duration-300",
            /* Size-specific styles */
            size === "leaderboard" && "rounded-lg border border-white/10 bg-gradient-to-r from-rose-500/10 via-violet-500/10 to-rose-500/10 hover:from-rose-500/20 hover:via-violet-500/20 hover:to-rose-500/20 hover:border-rose-500/30",
            size === "native" && "rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-rose-500/25 p-3 sm:p-4",
            size === "rectangle" && "rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-rose-500/25 p-3",
            size === "mobile-banner" && "flex items-center justify-between bg-gradient-to-r from-rose-500/15 to-violet-500/15 border-t border-white/10 px-4 py-3",
            size === "popup-banner" && "rounded-lg border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] px-4 py-2.5",
            size === "banner" && "rounded-lg border border-white/10 bg-gradient-to-r from-rose-500/10 to-violet-500/10 hover:border-rose-500/30",
            size === "fluid" && "rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] p-3",
            sticky && "!rounded-none",
          )}
        >
          {/* ── Leaderboard / Banner render ── */}
          {(size === "leaderboard" || size === "banner") && (
            <div className="flex h-[90px] w-full items-center justify-between px-5 sm:px-6">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-violet-500">
                  <Play className="h-4 w-4 fill-white text-white" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold truncate">{copy.headline}</div>
                  <div className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground truncate">{copy.sub}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground/50">
                  <Shield className="h-2.5 w-2.5 text-emerald-400" aria-hidden="true" />
                  AD
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-500 to-violet-500 px-3 py-1.5 text-[11px] font-semibold text-white transition-transform group-hover/ad:scale-105">
                  {copy.cta}
                  <ExternalLink className="h-3 w-3 ml-0.5" aria-hidden="true" />
                </span>
              </div>
            </div>
          )}

          {/* ── Native ad render ── */}
          {size === "native" && (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-violet-500/20 border border-white/5">
                <Star className="h-6 w-6 text-rose-400" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-rose-400/80">Sponsored</span>
                  <span className="text-[10px] text-muted-foreground/40">•</span>
                  <span className="text-[10px] text-muted-foreground/50">Recommended</span>
                </div>
                <div className="mt-1 text-sm font-semibold truncate">{copy.headline}</div>
                <div className="mt-0.5 text-xs text-muted-foreground truncate">{copy.sub}</div>
              </div>
              <div className="shrink-0 hidden sm:flex flex-col items-end gap-1.5">
                <span className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-500 to-violet-500 px-3 py-1.5 text-[11px] font-semibold text-white">
                  {copy.cta}
                  <ExternalLink className="h-3 w-3 ml-0.5" aria-hidden="true" />
                </span>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
                  <span className="flex items-center gap-0.5"><Shield className="h-2.5 w-2.5 text-emerald-400" /> Secure</span>
                  <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" /> Updated</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Rectangle render ── */}
          {size === "rectangle" && (
            <div className="flex h-[250px] w-[300px] flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-violet-500/20">
                <Zap className="h-6 w-6 text-rose-400" aria-hidden="true" />
              </div>
              <div className="text-sm font-bold leading-snug px-2">{copy.headline}</div>
              <div className="text-xs text-muted-foreground px-4">{copy.sub}</div>
              <span className="mt-1 flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-500 to-violet-500 px-4 py-2 text-xs font-semibold text-white transition-transform group-hover/ad:scale-105">
                {copy.cta}
                <ExternalLink className="h-3 w-3 ml-0.5" aria-hidden="true" />
              </span>
            </div>
          )}

          {/* ── Mobile sticky render ── */}
          {size === "mobile-banner" && (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-rose-500 to-violet-500">
                  <Play className="h-3 w-3 fill-white text-white" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{copy.headline}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{copy.sub}</div>
                </div>
              </div>
              <span className="flex items-center gap-1 shrink-0 rounded-lg bg-gradient-to-r from-rose-500 to-violet-500 px-3 py-1.5 text-[11px] font-semibold text-white">
                {copy.cta}
                <ExternalLink className="h-3 w-3 ml-0.5" aria-hidden="true" />
              </span>
            </>
          )}

          {/* ── Popup banner render ── */}
          {size === "popup-banner" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">Sponsored</span>
                <span className="text-xs text-muted-foreground">{copy.headline}</span>
              </div>
              {copy.cta && (
                <span className="flex items-center gap-1 shrink-0 text-[10px] font-medium text-rose-400">
                  {copy.cta}
                  <ExternalLink className="h-2.5 w-2.5" aria-hidden="true" />
                </span>
              )}
            </div>
          )}

          {/* ── Fluid render ── */}
          {size === "fluid" && (
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-rose-400/80">Sponsored</span>
                </div>
                <div className="text-sm font-semibold">{copy.headline}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{copy.sub}</div>
              </div>
              <span className="flex items-center gap-1 shrink-0 rounded-lg bg-gradient-to-r from-rose-500 to-violet-500 px-3 py-1.5 text-[11px] font-semibold text-white">
                {copy.cta}
                <ExternalLink className="h-3 w-3 ml-0.5" aria-hidden="true" />
              </span>
            </div>
          )}
        </a>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   AD BANNER — Full-width horizontal ad between sections
   ════════════════════════════════════════════════════════════════ */
export function AdBanner({
  id,
  slot,
  className,
  label,
  dismissible = false,
}: {
  id: string;
  slot?: string;
  className?: string;
  label?: string;
  dismissible?: boolean;
}) {
  return (
    <div className={cn("py-5 sm:py-7", className)}>
      <AdSlot
        id={id}
        slot={slot}
        size="leaderboard"
        label={label}
        dismissible={dismissible}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   IN-CONTENT AD — Native-style ad within article content
   ════════════════════════════════════════════════════════════════ */
export function InContentAd({
  id,
  slot,
  className,
  label,
}: {
  id: string;
  slot?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("my-8 sm:my-10", className)}>
      <AdSlot
        id={id}
        slot={slot}
        size="native"
        className="w-full max-w-3xl mx-auto"
        label={label}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SIDEBAR AD — Rectangle ad for side placement
   ════════════════════════════════════════════════════════════════ */
export function SidebarAd({
  id,
  slot,
  className,
  label,
}: {
  id: string;
  slot?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("flex justify-center", className)}>
      <AdSlot
        id={id}
        slot={slot}
        size="rectangle"
        label={label}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STICKY MOBILE BOTTOM AD BAR
   ════════════════════════════════════════════════════════════════ */
export function MobileStickyAd({
  id,
  slot,
  className,
}: {
  id: string;
  slot?: string;
  className?: string;
}) {
  return (
    <div className={cn("md:hidden", className)}>
      <AdSlot
        id={id}
        slot={slot}
        size="mobile-banner"
        label="Mobile Sticky"
        dismissible
        sticky="bottom"
      />
      {/* Safe area spacer so content isn't hidden behind the sticky bar */}
      <div className="h-[50px]" aria-hidden="true" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   POPUP BANNER — Compact ad inside the content popup
   ════════════════════════════════════════════════════════════════ */
export function PopupBanner({
  id,
  slot,
  className,
}: {
  id: string;
  slot?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-0", className)}>
      <AdSlot
        id={id}
        slot={slot}
        size="popup-banner"
        label="Popup Banner"
      />
    </div>
  );
}
