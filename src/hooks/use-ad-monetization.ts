"use client";

import { useEffect, useCallback, useRef } from "react";
import {
  AD_CONFIG,
  checkDailyCap,
  incrementDailyCap,
} from "@/lib/ad-config";

/* ════════════════════════════════════════════════════════════════
   AD MONETIZATION HOOK
   Manages the entire click funnel and ad trigger system.

   FUNNEL FLOW:
   ┌─────────────────────────────────────────────────────────┐
   │ 1. First click ANYWHERE on page                         │
   │    → Pre-load popunder script (once per 24h)           │
   │                                                         │
   │ 2. Click CTA (Watch / Play / card)                     │
   │    → Open popup: Age Gate → Loading → Content Page     │
   │    → Click content → smartlink + popunder (1st only)   │
   │                                                         │
   │ 3. User scrolls down 30%+ of page                       │
   │    → Trigger HilltopAds push notification (once/session)│
   └─────────────────────────────────────────────────────────┘
   ════════════════════════════════════════════════════════════════ */

const KEYS = AD_CONFIG.storageKeys;

/**
 * Load an external script dynamically and return a promise.
 * Uses a dedup map to prevent double-loading the same URL.
 */
function loadScriptOnce(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve();
      return;
    }
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

export function useAdMonetization() {
  const initialized = useRef(false);

  /* ── ADSTERRA POPUNDER: Load script on mount ── */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    loadScriptOnce(AD_CONFIG.adsterra.popunderScriptUrl);
  }, []);

  /* ── FIRST CLICK HANDLER: Mark first interaction ── */
  useEffect(() => {
    const handleFirstClick = () => {
      if (sessionStorage.getItem(KEYS.firstClickDone)) return;
      sessionStorage.setItem(KEYS.firstClickDone, "1");
    };

    document.addEventListener("click", handleFirstClick, { once: true });
    return () => document.removeEventListener("click", handleFirstClick);
  }, []);

  /* ── SCROLL HANDLER: Trigger push notification ── */
  useEffect(() => {
    if (sessionStorage.getItem(KEYS.pushRequested)) return;

    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      if (scrollPercent >= AD_CONFIG.behavior.pushScrollThreshold) {
        sessionStorage.setItem(KEYS.pushRequested, "1");

        setTimeout(() => {
          loadScriptOnce(AD_CONFIG.hilltopAds.pushScriptUrl);
        }, AD_CONFIG.behavior.pushScrollDelay);
      }
    };

    const handleScrollRef = handleScroll;
    window.addEventListener("scroll", handleScrollRef, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollRef);
  }, []);

  /* ── POPUNDER TRIGGER: For popup content clicks ── */
  const triggerPopunder = useCallback(() => {
    // Only fire once per session
    if (sessionStorage.getItem(KEYS.popupPopunderDone)) return false;
    if (!checkDailyCap(KEYS.popunderCountToday, AD_CONFIG.adsterra.dailyCap))
      return false;

    // Mark as done
    sessionStorage.setItem(KEYS.popupPopunderDone, "1");
    incrementDailyCap(KEYS.popunderCountToday);

    // Use Adsterra popunder URL (smartlink as fallback popunder)
    const popunderUrl = AD_CONFIG.adsterra.smartlinkUrl;
    if (!popunderUrl) return false;

    // Open a popunder window — opens behind the main window
    try {
      const popunder = window.open(popunderUrl, "_blank", "noopener,noreferrer");
      if (popunder) {
        // Immediately blur so it goes behind the current window
        popunder.blur();
        // Try to refocus the main window
        window.focus();
      }
    } catch {
      // Blocked by popup blocker — silently fail
    }

    return true;
  }, []);

  /* ── SMARTLINK REDIRECT: 50/50 Adsterra / HilltopAds ── */
  const triggerSmartlinkRedirect = useCallback(() => {
    const useHilltop = Math.random() < 0.5;
    const url = useHilltop
      ? AD_CONFIG.hilltopAds.smartlinkUrl
      : AD_CONFIG.adsterra.smartlinkUrl;
    if (!url) return false;

    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }, []);

  return {
    triggerSmartlinkRedirect,
    triggerPopunder,
  };
}
