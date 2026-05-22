type GtagCommand = 'config' | 'event' | 'js' | 'set';
type GtagValue = string | number | boolean | Date | null | undefined | Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: Record<string, GtagValue>) => void;
  }
}

export function trackEvent(eventName: string, params: Record<string, GtagValue> = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, params);
}
