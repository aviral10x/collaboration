import { track as trackVercelEvent } from '@vercel/analytics';

type GtagCommand = 'config' | 'event' | 'js' | 'set';
type GtagValue = string | number | boolean | Date | null | undefined | Record<string, unknown>;
type VercelEventValue = string | number | boolean | null | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: Record<string, GtagValue>) => void;
  }
}

export function trackEvent(eventName: string, params: Record<string, GtagValue> = {}) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  trackVercelEvent(eventName, toVercelEventProperties(params));
}

function toVercelEventProperties(params: Record<string, GtagValue>) {
  return Object.entries(params).reduce<Record<string, VercelEventValue>>((properties, [key, value]) => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null ||
      value === undefined
    ) {
      properties[key] = value;
    }

    return properties;
  }, {});
}
