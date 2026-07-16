/**
 * Optional declarative auto-tracking.
 *
 * Lets a static page fire typed events with zero inline JavaScript by adding
 * `data-fylos-*` attributes to elements, e.g.
 *
 *   <a href="https://app.fylos.me"
 *      data-fylos-event="cta_click"
 *      data-fylos-cta-id="hero_start"
 *      data-fylos-label="Start in the app"
 *      data-fylos-location="hero">Start</a>
 *
 * A single delegated click listener reads the attributes and calls `track`.
 * This helper is opt-in: it changes no layout and adds nothing to the page by
 * itself. Attributes are still routed through the consent gate + PII guard.
 */

import type { EventName, EventPropsMap } from './events';
import { EVENT_NAMES } from './events';

export interface AutoTrackingTarget {
  track<K extends EventName>(name: K, props: EventPropsMap[K]): boolean;
}

export interface AutoTrackingOptions {
  /** Root to delegate from. Defaults to document. */
  root?: Document | HTMLElement;
  /** Attribute holding the event name. Defaults to "data-fylos-event". */
  eventAttribute?: string;
}

const EVENT_NAME_SET = new Set<string>(EVENT_NAMES);

function coerce(value: string): string | number | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value !== '' && !Number.isNaN(Number(value)) && /^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  return value;
}

function collectProps(dataset: DOMStringMap): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {};
  for (const key of Object.keys(dataset)) {
    if (!key.startsWith('fylos') || key === 'fylosEvent') continue;
    const rest = key.slice('fylos'.length);
    if (!rest) continue;
    const propName = rest.charAt(0).toLowerCase() + rest.slice(1);
    const raw = dataset[key];
    if (raw != null) props[propName] = coerce(raw);
  }
  return props;
}

/**
 * Wire declarative `data-fylos-*` click tracking. Returns a cleanup function.
 * Safe no-op when there is no DOM.
 */
export function initAutoTracking(
  instance: AutoTrackingTarget,
  options: AutoTrackingOptions = {},
): () => void {
  if (typeof document === 'undefined') return () => {};

  const root: Document | HTMLElement = options.root ?? document;
  const attr = options.eventAttribute ?? 'data-fylos-event';

  const handler = (e: Event): void => {
    const start = e.target as Element | null;
    if (!start) return;
    const el = start.closest<HTMLElement>(`[${attr}]`);
    if (!el) return;
    const name = el.getAttribute(attr);
    if (!name || !EVENT_NAME_SET.has(name)) return;
    const props = collectProps(el.dataset);
    // Dynamic path: cast is intentional; the PII guard sanitizes the payload.
    instance.track(name as EventName, props as unknown as EventPropsMap[EventName]);
  };

  root.addEventListener('click', handler as EventListener);
  return () => root.removeEventListener('click', handler as EventListener);
}
