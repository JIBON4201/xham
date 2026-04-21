"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  Shield,
  AlertTriangle,
  Play,
  Clock,
  ExternalLink,
  Loader2,
  ArrowRight,
  Lock,
  Monitor,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Volume2,
  Maximize2,
  Settings,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AD_CONFIG } from "@/lib/ad-config";

/* ════════════════════════════════════════════════════════════════
   WATCH NOW POPUP — REDESIGNED FLOW

   Step 1:  Age Verification Gate
   Step 2:  Loading Screen (2-3 sec fake loading)
   Step 3:  Content Page (fake video player + small banner ad)
   Step 4:  Click "Play" → Smartlink opens + Popunder (1st click only)

   Props:
   - open: boolean to show/hide popup
   - onClose: callback when popup is dismissed
   - onContentClick: callback(contentId) for smartlink + popunder
   ════════════════════════════════════════════════════════════════ */

interface WatchNowPopupProps {
  open: boolean;
  onClose: () => void;
  onContentClick?: (contentId: string) => void;
}

const LOADING_DURATION = AD_CONFIG.behavior.loadingScreenDuration;

/* Fake content data for the content page */
const CONTENT_DATA = [
  {
    id: "featured-1",
    title: "Exclusive Private Session — Premium HD",
    channel: "VaultStream Originals",
    views: "1.2M views",
    likes: "48.7K",
    time: "2 days ago",
    duration: "18:42",
    thumb: "/ai-gallery/scene-02.png",
    description:
      "Watch this exclusive premium content in full HD. Available only on VaultStream — the most trusted private streaming platform.",
    tags: ["Exclusive", "HD", "Premium"],
  },
  {
    id: "featured-2",
    title: "Trending Now — Limited Time Only",
    channel: "VS Premium",
    views: "892K views",
    likes: "37.1K",
    time: "5 hours ago",
    duration: "24:15",
    thumb: "/ai-gallery/scene-08.png",
    description:
      "Most-watched content this week. Stream in 4K with zero buffering. Completely free, no signup required.",
    tags: ["Trending", "4K", "New"],
  },
  {
    id: "featured-3",
    title: "Members Only Collection — Uncut Version",
    channel: "VaultStream Gold",
    views: "2.1M views",
    likes: "92.4K",
    time: "1 week ago",
    duration: "32:08",
    thumb: "/ai-gallery/scene-18.png",
    description:
      "Full uncut collection available now. End-to-end encrypted streaming with zero tracking. Watch privately.",
    tags: ["Uncut", "Encrypted", "VIP"],
  },
];

/* Randomly pick featured content per session */
const FEATURED =
  CONTENT_DATA[Math.floor(Math.random() * CONTENT_DATA.length)];

export function WatchNowPopup({ open, onClose, onContentClick }: WatchNowPopupProps) {
  const [step, setStep] = useState<"age-gate" | "loading" | "content">(
    "age-gate"
  );
  const [loadingProgress, setLoadingProgress] = useState(0);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const contentClickedRef = useRef(false);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Transition from age gate → loading
  const handleAgeConfirm = useCallback(() => {
    setStep("loading");
    setLoadingProgress(0);

    // Animate progress bar
    progressIntervalRef.current = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 88) {
          if (progressIntervalRef.current)
            clearInterval(progressIntervalRef.current);
          return 88;
        }
        return prev + Math.random() * 12 + 4;
      });
    }, 150);

    // After loading duration, show content page
    redirectTimerRef.current = setTimeout(() => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      setLoadingProgress(100);

      // Small delay to show 100%, then transition
      setTimeout(() => {
        setStep("content");
      }, 400);
    }, LOADING_DURATION);
  }, []);

  // Content play click → smartlink + popunder
  const handlePlayClick = useCallback(
    (contentId: string) => {
      if (contentClickedRef.current) return;
      contentClickedRef.current = true;

      // Notify parent to trigger popunder + smartlink
      if (onContentClick) {
        onContentClick(contentId);
      }
    },
    [onContentClick]
  );

  // Close handler (only after age gate)
  const handleClose = useCallback(() => {
    if (step === "age-gate" || step === "loading") return;
    onClose();
  }, [step, onClose]);

  // ESC to close (only on content step)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step === "content") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Full-screen backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm"
            onClick={
              step === "content" ? handleClose : undefined
            }
            aria-hidden="true"
          />

          {/* ── Popup container ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-2 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Content access"
          >
            <AnimatePresence mode="wait">
              {/* ════════════════════════════════════════════════════
                 STEP 1: AGE VERIFICATION GATE
                 ════════════════════════════════════════════════════ */}
              {step === "age-gate" && (
                <motion.div
                  key="age-gate"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card relative w-full max-w-md rounded-2xl border border-white/10 p-8 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-violet-500/20">
                    <AlertTriangle
                      className="h-8 w-8 text-rose-400"
                      aria-hidden="true"
                    />
                  </div>

                  <h2 className="text-xl font-bold sm:text-2xl">
                    Age Verification Required
                  </h2>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    This platform contains{" "}
                    <strong className="text-foreground/80">adult content</strong>{" "}
                    that is intended for individuals aged 18 and above. By
                    proceeding, you confirm that you are of legal age in your
                    jurisdiction.
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-muted-foreground">
                      <Shield
                        className="h-3 w-3 text-rose-400"
                        aria-hidden="true"
                      />
                      AES-256 Encrypted
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-muted-foreground">
                      <Lock
                        className="h-3 w-3 text-rose-400"
                        aria-hidden="true"
                      />
                      Zero Logging
                    </div>
                  </div>

                  <Button
                    onClick={handleAgeConfirm}
                    size="lg"
                    className="mt-6 animate-glow w-full rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-6 text-base font-semibold text-white hover:from-rose-600 hover:to-violet-600 transition-all duration-300"
                  >
                    I Am 18+ — Enter Now
                    <ArrowRight
                      className="ml-2 h-4 w-4"
                      aria-hidden="true"
                    />
                  </Button>

                  <p className="mt-4 text-[11px] text-muted-foreground/60">
                    By entering, you agree to our Terms of Service and confirm
                    you are at least 18 years old.
                  </p>
                </motion.div>
              )}

              {/* ════════════════════════════════════════════════════
                 STEP 2: LOADING SCREEN (2-3 sec)
                 ════════════════════════════════════════════════════ */}
              {step === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card relative w-full max-w-md rounded-2xl border border-white/10 p-8 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-violet-500/20">
                    <div className="relative">
                      <Loader2
                        className="h-10 w-10 animate-spin text-rose-400"
                        aria-hidden="true"
                      />
                      <Play
                        className="absolute inset-0 m-auto h-4 w-4 fill-white text-white"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <h2 className="text-lg font-bold sm:text-xl">
                    Loading Content…
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Connecting to secure encrypted stream
                  </p>

                  <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-violet-500"
                      animate={{
                        width: `${Math.min(loadingProgress, 100)}%`,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-muted-foreground/60">
                    <span className="flex items-center gap-1">
                      <Monitor className="h-3 w-3" aria-hidden="true" />
                      HD 1080p
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" aria-hidden="true" />
                      Encrypted
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3" aria-hidden="true" />
                      Secure
                    </span>
                  </div>

                  <p className="mt-4 text-[11px] text-muted-foreground/40">
                    Please wait while we prepare your content…
                  </p>
                </motion.div>
              )}

              {/* ════════════════════════════════════════════════════
                 STEP 3: CONTENT PAGE (fake video + banner ad)
                 ════════════════════════════════════════════════════ */}
              {step === "content" && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card relative flex w-full max-w-4xl max-h-[92vh] flex-col overflow-hidden rounded-2xl border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* ── Top bar ── */}
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 sm:px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-violet-500">
                        <Play
                          className="h-3 w-3 fill-white text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-sm font-bold tracking-tight">
                        Vault<span className="text-gradient">Stream</span>
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">
                        <Shield
                          className="h-2.5 w-2.5 text-emerald-400"
                          aria-hidden="true"
                        />
                        Secure
                      </span>
                    </div>

                    <button
                      onClick={handleClose}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* ── Scrollable content ── */}
                  <div className="flex-1 overflow-y-auto">
                    {/* Fake Video Player */}
                    <div
                      className="relative aspect-video w-full cursor-pointer overflow-hidden bg-black"
                      onClick={() => handlePlayClick(FEATURED.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handlePlayClick(FEATURED.id);
                        }
                      }}
                      aria-label={`Play ${FEATURED.title}`}
                    >
                      <Image
                        src={FEATURED.thumb}
                        alt={FEATURED.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 896px"
                        priority
                      />

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/30 transition-colors duration-300 hover:bg-black/20" />

                      {/* Center play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-2xl transition-all duration-300 hover:bg-white/30"
                        >
                          <Play
                            className="h-8 w-8 fill-white text-white ml-1"
                            aria-hidden="true"
                          />
                        </motion.div>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white/90 backdrop-blur-sm font-medium">
                        {FEATURED.duration}
                      </div>

                      {/* Bottom controls bar */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-8 pb-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="h-1 w-full rounded-full bg-white/20 mb-3">
                          <div className="h-full w-1/3 rounded-full bg-rose-500" />
                        </div>
                      </div>
                    </div>

                    {/* ── Banner Ad (below player) ── */}
                    <div
                      className="mx-4 mt-3 sm:mx-5"
                      data-ad-slot="content-page-banner"
                    >
                      <div className="flex items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5">
                        {/*
                          ╔═══════════════════════════════════════╗
                          ║  REPLACE WITH REAL AD CODE             ║
                          ║  Adsterra / HilltopAds banner          ║
                          ╚═══════════════════════════════════════╝
                        */}
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/30">
                          Advertisement
                        </span>
                      </div>
                    </div>

                    {/* ── Video Info ── */}
                    <div className="px-4 pt-4 pb-2 sm:px-5">
                      <h2 className="text-base font-bold sm:text-lg leading-snug">
                        {FEATURED.title}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" aria-hidden="true" />
                          {FEATURED.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                          {FEATURED.likes}
                        </span>
                        <span>{FEATURED.time}</span>
                        <span className="flex items-center gap-1 text-rose-400">
                          <Shield className="h-3 w-3" aria-hidden="true" />
                          Encrypted
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-3 flex items-center gap-2">
                        <button className="flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Like
                        </button>
                        <button className="flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
                          <MessageCircle className="h-3.5 w-3.5" />
                          Comment
                        </button>
                        <button className="flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
                          <Share2 className="h-3.5 w-3.5" />
                          Share
                        </button>
                      </div>

                      {/* Channel info */}
                      <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/30 to-violet-500/30 text-xs font-bold">
                          VS
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {FEATURED.channel}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {Math.floor(Math.random() * 500 + 200)}K
                            subscribers
                          </div>
                        </div>
                        <Button
                          onClick={() => handlePlayClick(FEATURED.id)}
                          size="sm"
                          className="rounded-lg bg-gradient-to-r from-rose-500 to-violet-500 px-4 text-xs font-semibold text-white hover:from-rose-600 hover:to-violet-600 transition-all"
                        >
                          <Play
                            className="mr-1.5 h-3 w-3 fill-white"
                            aria-hidden="true"
                          />
                          Watch Now
                        </Button>
                      </div>

                      {/* Description */}
                      <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/5 p-3.5">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {FEATURED.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {FEATURED.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── Related Content Grid ── */}
                    <div className="px-4 py-4 sm:px-5">
                      <h3 className="mb-3 text-sm font-semibold">
                        Related Content
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {CONTENT_DATA.filter((c) => c.id !== FEATURED.id).map(
                          (item) => (
                            <div
                              key={item.id}
                              className="group cursor-pointer rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-rose-500/30 hover:bg-white/[0.04]"
                              onClick={() => handlePlayClick(item.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handlePlayClick(item.id);
                                }
                              }}
                              aria-label={`Play ${item.title}`}
                            >
                              <div className="relative aspect-video overflow-hidden">
                                <Image
                                  src={item.thumb}
                                  alt={item.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  sizes="(max-width: 640px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white/80">
                                  {item.duration}
                                </div>
                                {/* Hover play icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                    <Play
                                      className="h-4 w-4 fill-white text-white ml-0.5"
                                      aria-hidden="true"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="p-2.5">
                                <div className="text-xs font-medium leading-tight line-clamp-2">
                                  {item.title}
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                                  <span>{item.channel}</span>
                                  <span>•</span>
                                  <span>{item.views}</span>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
