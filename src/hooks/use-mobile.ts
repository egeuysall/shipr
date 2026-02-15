import * as React from "react";

/** Breakpoint (in pixels) at which the layout switches from mobile to desktop. */
const MOBILE_BREAKPOINT = 768;

/**
 * Reactive hook that returns `true` when the viewport width is below {@link MOBILE_BREAKPOINT}.
 *
 * Uses `window.matchMedia` so it responds to live resize / orientation changes
 * without polling. Returns `false` on the server and during the first client
 * render (before the media-query listener fires).
 *
 * @returns Whether the current viewport is considered mobile.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
