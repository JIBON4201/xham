"use client";

import { useEffect, useRef } from "react";
import { AD_CONFIG } from "@/lib/ad-config";

/* ════════════════════════════════════════════════════════════════
   AD SCRIPTS PROVIDER
   Manages third-party ad network script injection.

   Current active scripts:
   - Adsterra popunder (pre-loaded on mount)
   - HilltopAds push (lazy-loaded on scroll, handled by hook)

   When you get real ad display scripts from Adsterra/HilltopAds,
   add their URLs to ad-config.ts and add injection calls here.
   ════════════════════════════════════════════════════════════════ */

const loadedScripts = new Set<string>();

function injectScript(url: string, id: string, async = true): void {
  if (!url) return;
  if (loadedScripts.has(id)) return;

  const script = document.createElement("script");
  script.src = url;
  script.async = async;
  script.id = id;

  script.onload = () => {
    loadedScripts.add(id);
  };

  script.onerror = () => {
    // Ad script failed — don't block the page
    console.warn(`[AdScripts] Failed to load script: ${id}`);
  };

  document.head.appendChild(script);
}

export function AdScriptsProvider() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // 1. Adsterra popunder script — pre-loads on mount
    //    This typically auto-binds to clicks and opens a popunder.
    if (AD_CONFIG.adsterra.popunderScriptUrl) {
      injectScript(
        AD_CONFIG.adsterra.popunderScriptUrl,
        "adsterra-popunder-script"
      );
    }

    // 2. HilltopAds push script — loaded by useAdMonetization hook
    //    after user scrolls 30%+ of the page (lazy, non-blocking).

    // ── ADD MORE AD NETWORK SCRIPTS HERE ──
    // Example:
    // if (AD_CONFIG.someNetwork.displayScriptUrl) {
    //   injectScript(AD_CONFIG.someNetwork.displayScriptUrl, "some-network-display");
    // }
  }, []);

  // Renders nothing
  return null;
}
