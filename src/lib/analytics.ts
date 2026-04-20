import posthog from "posthog-js";

let initialized = false;

export const initAnalytics = () => {
  if (initialized) return;
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const host = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://us.i.posthog.com";

  if (!key) {
    // No key configured — keep a console-only stub so events are visible during dev.
    // Set VITE_POSTHOG_KEY to enable real tracking.
    // eslint-disable-next-line no-console
    console.info("[analytics] PostHog disabled (no VITE_POSTHOG_KEY). Events will be logged to console.");
    initialized = true;
    return;
  }

  posthog.init(key, {
    api_host: host,
    capture_pageview: false, // we capture manually per route
    persistence: "localStorage+cookie",
  });
  initialized = true;
};

export type AnalyticsEvent =
  | "page_view"
  | "signup_started"
  | "board_connected"
  | "first_message"
  | "voice_message";

export const track = (event: AnalyticsEvent, properties?: Record<string, unknown>) => {
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  if (!key) {
    // eslint-disable-next-line no-console
    console.log(`[analytics] ${event}`, properties ?? {});
    return;
  }
  posthog.capture(event, properties);
};

export const identify = (distinctId: string, properties?: Record<string, unknown>) => {
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  if (!key) return;
  posthog.identify(distinctId, properties);
};
