"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Loader2, ExternalLink, Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════
   INTERSTITIAL AD SLOT
   Full-width ad placeholder for inside the popup
   ════════════════════════════════════════════════════════════════ */
function PopupAdSlot({
  id,
  slot,
  className,
}: {
  id: string;
  slot?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id={`popup-ad-${id}`}
      data-ad-slot={slot || id}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]",
        className
      )}
      aria-label="Advertisement"
      role="complementary"
    >
      {visible && (
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40">
            {slot || `popup-${id}`}
          </span>
          {/*
            ╔═══════════════════════════════════════════════════════╗
            ║  REPLACE THIS PLACEHOLDER WITH YOUR REAL AD CODE      ║
            ║                                                      ║
            ║  Example — Popunder / Interstitial network:           ║
            ║  <script>                                             ║
            ║    // Popunder trigger code here                      ║
            ║    window.open("ad-url", "_blank");                  ║
            ║  </script>                                           ║
            ║                                                      ║
            ║  Example — PropellerAds interstitial:                ║
            ║  <script src="//a.magsrv.com/ad-provider.js" />     ║
            ╚═══════════════════════════════════════════════════════╝
          */}
          <div className="flex h-16 w-full items-center justify-center rounded-md border border-dashed border-white/10 text-muted-foreground/25">
            <div className="text-center">
              <ExternalLink className="mx-auto mb-1 h-5 w-5" />
              <span className="text-[10px]">Ad Placement</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 1: AGE VERIFICATION GATE
   ════════════════════════════════════════════════════════════════ */
function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [exitIntent, setExitIntent] = useState(false);

  // Detect mouse leaving viewport (exit intent)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) setExitIntent(true);
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center text-center"
    >
      {/* 18+ icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-rose-500/30 bg-rose-500/10">
        <AlertTriangle className="h-10 w-10 text-rose-400" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Age Verification Required
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
        This section contains adult content. You must confirm you are at
        least 18 years old (or the legal age in your jurisdiction) to
        proceed.
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        <Button
          onClick={onConfirm}
          className="h-12 w-full rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 text-base font-semibold text-white hover:from-rose-600 hover:to-violet-600 transition-all"
        >
          <ShieldCheck className="mr-2 h-5 w-5" />
          I Am 18 or Older — Enter
        </Button>
        <p className="text-[11px] text-muted-foreground/50">
          By clicking enter, you confirm you meet the age requirement and
          accept our Terms of Service.
        </p>
      </div>

      {/* Exit intent warning */}
      <AnimatePresence>
        {exitIntent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-400"
          >
            Content is age-restricted. Please confirm to continue.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   STEP 2: LOADING / AD DISPLAY SCREEN
   Full-screen ad interstitial with countdown
   ════════════════════════════════════════════════════════════════ */
function AdInterstitial({
  onComplete,
  redirectUrl,
}: {
  onComplete: () => void;
  redirectUrl: string;
}) {
  const COUNTDOWN_SECONDS = 5;
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [phase, setPhase] = useState<"loading" | "ads" | "ready">("loading");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Phase 1: Loading simulation (1.5s)
    const loadTimer = setTimeout(() => {
      setPhase("ads");

      // Phase 2: Countdown after ads appear
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase("ready");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);

    return () => {
      clearTimeout(loadTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center gap-5"
    >
      {/* Header bar */}
      <div className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Play className="h-4 w-4 text-rose-400" />
          <span className="hidden sm:inline">Preparing your stream...</span>
          <span className="sm:hidden">Loading...</span>
        </div>
        {phase === "loading" ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading</span>
          </div>
        ) : phase === "ads" ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-rose-400">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>Please wait {countdown}s</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Ready</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-violet-500"
          initial={{ width: "0%" }}
          animate={{
            width:
              phase === "loading"
                ? "20%"
                : phase === "ads"
                  ? `${20 + ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 60}%`
                  : "100%",
          }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </div>

      {/* Loading phase */}
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-10"
          >
            <Loader2 className="h-10 w-10 animate-spin text-rose-400" />
            <p className="text-sm text-muted-foreground">
              Connecting to secure stream...
            </p>
          </motion.div>
        )}

        {/* Ads phase */}
        {phase === "ads" && (
          <motion.div
            key="ads"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full space-y-4"
          >
            {/* Ad 1 — Top leaderboard */}
            <PopupAdSlot id="popup-top" slot="popup-leaderboard-728x90" className="h-[90px] w-full max-w-[728px] mx-auto" />

            {/* Ad grid: 2 rectangles side by side on desktop */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PopupAdSlot id="popup-left" slot="popup-rectangle-300x250-a" className="h-[250px]" />
              <PopupAdSlot id="popup-right" slot="popup-rectangle-300x250-b" className="h-[250px]" />
            </div>

            {/* Ad 2 — Bottom leaderboard */}
            <PopupAdSlot id="popup-bottom" slot="popup-leaderboard-728x90-b" className="h-[90px] w-full max-w-[728px] mx-auto" />

            {/* Native-style ad */}
            <PopupAdSlot id="popup-native" slot="popup-native-ad" className="h-[100px] w-full" />
          </motion.div>
        )}

        {/* Ready phase */}
        {phase === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-full flex-col items-center gap-6 py-6"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Stream Ready</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Your secure connection is established. Click below to
                start watching exclusive content now.
              </p>
            </div>

            {/* Final CTA with redirect */}
            <a
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-xs"
            >
              <Button
                size="lg"
                className="animate-glow h-13 w-full rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-8 text-base font-semibold text-white hover:from-rose-600 hover:to-violet-600 transition-all"
              >
                <Play className="mr-2 h-5 w-5 fill-white" />
                Continue Watching
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>

            <p className="text-[11px] text-muted-foreground/40 text-center max-w-xs">
              You will be redirected to our secure streaming partner.
              Connection is encrypted and anonymous.
            </p>

            {/* One more ad below CTA */}
            <PopupAdSlot id="popup-cta-bottom" slot="popup-cta-bottom-728x90" className="h-[90px] w-full max-w-[728px] mx-auto mt-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close button (small, only in ad/ready phase) */}
      {phase !== "loading" && (
        <button
          onClick={onComplete}
          className="mt-2 text-[11px] text-muted-foreground/40 hover:text-muted-foreground transition-colors underline underline-offset-2"
        >
          Close this window
        </button>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN POPUP COMPONENT
   ════════════════════════════════════════════════════════════════ */
interface WatchNowPopupProps {
  open: boolean;
  onClose: () => void;
  /** External URL to redirect to after the ad flow */
  redirectUrl?: string;
}

export function WatchNowPopup({
  open,
  onClose,
  redirectUrl = "#",
}: WatchNowPopupProps) {
  // Step is derived from open state — always starts at age gate
  const [proceeded, setProceeded] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Manage body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC key handler — only allow close in ad/ready phase
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && proceeded) {
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, proceeded, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleAgeConfirm = useCallback(() => {
    setProceeded(true);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Full-screen backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            onClick={(e) => {
              // Prevent closing by clicking backdrop during age gate
              if (!proceeded) return;
            }}
          />

          {/* Popup container */}
          <motion.div
            ref={bodyRef}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[101] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
          >
            {/* Close button (top-right, not on age gate) */}
            {proceeded && (
              <button
                onClick={handleClose}
                className="fixed top-4 right-4 z-[102] flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Close popup"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Card */}
            <div
              className={cn(
                "glass-card relative w-full max-w-3xl rounded-2xl border border-white/10 p-6 sm:p-8",
                !proceeded && "max-w-md"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* VaultStream branding */}
              <div className="mb-6 flex items-center justify-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-rose-500 to-violet-500">
                  <Play className="h-3.5 w-3.5 fill-white text-white" />
                </div>
                <span className="text-sm font-bold tracking-tight text-white/80">
                  Vault<span className="text-gradient">Stream</span>
                </span>
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                {!proceeded && (
                  <AgeGate key="age" onConfirm={handleAgeConfirm} />
                )}
                {proceeded && (
                  <AdInterstitial
                    key="ads"
                    onComplete={handleClose}
                    redirectUrl={redirectUrl}
                  />
                )}
              </AnimatePresence>

              {/* Bottom disclaimer */}
              <p className="mt-6 text-center text-[10px] text-muted-foreground/30">
                By using this service, you agree to our Terms of Service
                and confirm you are 18+. Content is legally compliant.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
