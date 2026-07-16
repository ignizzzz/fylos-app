/**
 * The typed event catalogue.
 *
 * Every payload shape below is deliberately closed (no index signature) and
 * contains ONLY non-personal metadata. There is no field for a person's name,
 * email, message text, or pet health information anywhere in this file, so the
 * type system itself is the first line of defence against leaking PII. The
 * runtime PII guard (see `pii.ts`) is the second line of defence for the
 * dynamic escape hatch.
 */

import type { ConsentCategory } from './types';

/** A click on a call-to-action (button or link). */
export interface CtaClickProps {
  /** Stable identifier for the CTA, e.g. "hero_get_id", "footer_join". */
  ctaId: string;
  /** Human-readable label, e.g. "Get Rex's ID". Non-PII UI copy. */
  label?: string;
  /** Where on the page/experience it lives, e.g. "hero", "tag_overlay". */
  location?: string;
  /** Destination category, not the raw URL. */
  destination?: 'internal' | 'external' | 'app' | 'store' | 'download' | 'anchor' | 'mailto';
  /** Optional sanitized href (query string stripped, no addresses). */
  href?: string;
  /** A/B or visual variant identifier. */
  variant?: string;
}

/** The scroll-driven "film" / story experience began. */
export interface StorytellingStartedProps {
  storyId: string;
  title?: string;
  /** How the story was entered, e.g. "scroll", "autoplay", "deeplink". */
  entryPoint?: string;
}

/** The story experience reached (or left near) the end. */
export interface StorytellingCompletedProps {
  storyId: string;
  /** How many scenes/segments were actually viewed. */
  scenesViewed?: number;
  /** Total scenes in the story. */
  scenesTotal?: number;
  /** Whether the viewer reached the true end. */
  completed?: boolean;
  /** Time spent, milliseconds. */
  durationMs?: number;
}

/** A product feature block scrolled into view (vet, groomer, park, tag ...). */
export interface FeatureViewedProps {
  /** Feature key, e.g. "vet", "groomer", "park", "tag". */
  feature: string;
  /** Sub-scene / card within the feature, e.g. "health_book". */
  scene?: string;
  /** Section grouping if relevant. */
  section?: string;
  /** Ordinal position of the feature in the page. */
  index?: number;
}

/** The user focused/interacted with a form field for the first time. */
export interface FormStartedProps {
  /** Stable form identifier, e.g. "join", "apply". */
  formId: string;
  /** Human-readable form name. */
  formName?: string;
}

/**
 * A form was submitted. IMPORTANT: `fields` is a list of field *names* only,
 * never their values. No entered name/email/message is ever included.
 */
export interface FormSubmittedProps {
  formId: string;
  formName?: string;
  /** Names of the fields present (NOT their values). */
  fields?: string[];
  /** Whether submission succeeded (client-side). */
  success?: boolean;
  /** Number of validation errors, if any. */
  errorCount?: number;
}

/** A download / app-install link was clicked. */
export interface DownloadClickedProps {
  /** What was requested, e.g. "app", "pet_id_pdf". */
  target: string;
  platform?: 'ios' | 'android' | 'web' | 'desktop' | 'unknown';
  store?: 'app_store' | 'play' | 'direct';
  /** Where the click happened, e.g. "tag_overlay". */
  location?: string;
  /** File type where applicable, e.g. "pdf". */
  fileType?: string;
}

/** An article / editorial page was viewed (e.g. the "/why" rationale). */
export interface ArticleViewedProps {
  articleId: string;
  /** Article title (editorial copy, non-PII). */
  title?: string;
  category?: string;
  /** BCP-47 locale, e.g. "el", "en". */
  locale?: string;
  /** Estimated read time in seconds. */
  readTimeSec?: number;
}

/** Maps each event name to its (PII-free) payload type. */
export interface EventPropsMap {
  cta_click: CtaClickProps;
  storytelling_started: StorytellingStartedProps;
  storytelling_completed: StorytellingCompletedProps;
  feature_viewed: FeatureViewedProps;
  form_started: FormStartedProps;
  form_submitted: FormSubmittedProps;
  download_clicked: DownloadClickedProps;
  article_viewed: ArticleViewedProps;
}

/** Union of all supported event names. */
export type EventName = keyof EventPropsMap;

/** Ordered list of the supported event names (handy for validation/tests). */
export const EVENT_NAMES: readonly EventName[] = [
  'cta_click',
  'storytelling_started',
  'storytelling_completed',
  'feature_viewed',
  'form_started',
  'form_submitted',
  'download_clicked',
  'article_viewed',
];

/**
 * Default consent category for each event. All eight product events are
 * nonessential analytics, so they stay disabled until analytics consent is
 * granted. Overridable per-instance via config.
 */
export const DEFAULT_EVENT_CATEGORY: Readonly<Record<EventName, ConsentCategory>> = {
  cta_click: 'analytics',
  storytelling_started: 'analytics',
  storytelling_completed: 'analytics',
  feature_viewed: 'analytics',
  form_started: 'analytics',
  form_submitted: 'analytics',
  download_clicked: 'analytics',
  article_viewed: 'analytics',
};

/** A fully-typed event envelope handed to adapters. */
export interface AnalyticsEvent<K extends EventName = EventName> {
  name: K;
  category: ConsentCategory;
  props: EventPropsMap[K];
}
