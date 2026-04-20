import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track } from "@/lib/analytics";

/**
 * Fires a `page_view` event whenever the route changes.
 * Mount once near the router root.
 */
export const usePageView = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    track("page_view", {
      path: pathname,
      search,
      url: window.location.href,
      referrer: document.referrer || null,
      title: document.title,
    });
  }, [pathname, search]);
};
