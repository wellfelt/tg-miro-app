import posthog from "posthog-js";

const POSTHOG_KEY = "phc_pNkPZfZJMfvUqjdGiFvs7SmYFwGpJ6pQLFuKJYFDQYpr";
const POSTHOG_HOST = "https://us.i.posthog.com";

let initialized = false;

export const initAnalytics = () => {
  if (initialized) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
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
  posthog.capture(event, properties);
};

export const identify = (distinctId: string, properties?: Record<string, unknown>) => {
  posthog.identify(distinctId, properties);
};
