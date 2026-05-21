type GtagCommand = 'config' | 'event' | 'js' | 'set';
type GtagValue = string | number | boolean | Date | null | undefined | Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: Record<string, GtagValue>) => void;
  }
}

const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim();

export function initAnalytics() {
  if (!measurementId || typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((command, target, params) => {
    window.dataLayer?.push([command, target, params]);
  });

  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
  });
}

export function trackEvent(eventName: string, params: Record<string, GtagValue> = {}) {
  if (!measurementId || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, params);
}
