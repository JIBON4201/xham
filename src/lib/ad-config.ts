/* ════════════════════════════════════════════════════════════════
   AD NETWORK CONFIGURATION
   Central config for all ad network integrations.

   FLOW:
     Age Gate → Loading Screen → Content Page (+ banner ad) → Click → Smartlink
     Popunder fires on first content-page click only
   ════════════════════════════════════════════════════════════════ */

export const AD_CONFIG = {
  /* ── Adsterra ── */
  adsterra: {
    /**
     * Popunder script URL from Adsterra dashboard.
     * Replace with your actual Adsterra popunder zone script.
     */
    popunderScriptUrl: "",

    /**
     * Smartlink URL for CTA button redirects.
     * Primary redirect after content click.
     */
    smartlinkUrl:
      "https://www.profitablecpmratenetwork.com/x7t4wtmc?key=f7dd2511d069b51139c0df6447d8a8d1",

    /** Max popunder triggers per 24-hour window (0 = unlimited) */
    dailyCap: 1,
  },

  /* ── HilltopAds ── */
  hilltopAds: {
    /**
     * Push notification script URL.
     * Replace with your HilltopAds push subscription script.
     */
    pushScriptUrl: "",

    /**
     * HilltopAds smartlink URL.
     * Alternate redirect for revenue variety (50/50 rotation).
     */
    smartlinkUrl: "https://splendid-garage.com/XkAEZp",

    /** Max push notification permission requests per session */
    pushRequestCapPerSession: 1,
  },

  /* ── General Settings ── */
  behavior: {
    /** Delay (ms) before triggering popunder on first click */
    popunderDelay: 0,

    /** Minimum scroll percentage before triggering push notification */
    pushScrollThreshold: 30,

    /** Delay (ms) before push notification fires after scroll threshold */
    pushScrollDelay: 2000,

    /** Fake loading screen duration (ms) before showing content page */
    loadingScreenDuration: 2500,
  },

  /* ── Frequency Capping Storage Keys ── */
  storageKeys: {
    lastPopunderTime: "vs_popunder_last",
    popunderCountToday: "vs_popunder_count_today",
    lastPopunderDate: "vs_popunder_date",
    pushRequested: "vs_push_requested_session",
    firstClickDone: "vs_first_click_done_session",
    /** Popunder already fired inside popup (per session) */
    popupPopunderDone: "vs_popup_popunder_session",
  },
} as const;

/** Helper: check if a date string matches today (YYYY-MM-DD) */
export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().slice(0, 10);
}

/** Helper: get current timestamp */
export function now(): number {
  return Date.now();
}

/** Helper: check daily cap using localStorage */
export function checkDailyCap(key: string, cap: number): boolean {
  if (cap <= 0) return true; // unlimited
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = localStorage.getItem(`${key}_date`);
  const count = parseInt(localStorage.getItem(key) || "0", 10);

  if (lastDate !== today) {
    localStorage.setItem(`${key}_date`, today);
    localStorage.setItem(key, "0");
    return true;
  }
  return count < cap;
}

/** Helper: increment daily cap counter */
export function incrementDailyCap(key: string): void {
  const count = parseInt(localStorage.getItem(key) || "0", 10) + 1;
  localStorage.setItem(key, count.toString());
  localStorage.setItem(`${key}_date`, new Date().toISOString().slice(0, 10));
}
