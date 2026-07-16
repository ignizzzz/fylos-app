import { describe, it, expect } from 'vitest';
import {
  sanitizeProps,
  isPiiKey,
  looksLikeEmail,
  looksLikePhone,
  sanitizeUrlValue,
  normalizeKey,
} from '../src/pii';

const TOKEN = '[redacted]';

describe('PII key detection', () => {
  it('normalizes key variants', () => {
    expect(normalizeKey('first_name')).toBe('firstname');
    expect(normalizeKey('First-Name')).toBe('firstname');
    expect(normalizeKey('e mail')).toBe('email');
  });

  it('flags identity, contact, message and health keys', () => {
    for (const k of [
      'name',
      'firstName',
      'email',
      'e-mail',
      'phone',
      'message',
      'address',
      'diagnosis',
      'medication',
      'weight',
      'allergies',
      'password',
    ]) {
      expect(isPiiKey(k)).toBe(true);
    }
  });

  it('does not flag safe analytics keys', () => {
    for (const k of ['ctaId', 'label', 'feature', 'storyId', 'title', 'formId', 'target']) {
      expect(isPiiKey(k)).toBe(false);
    }
  });

  it('honours extra denied keys', () => {
    expect(isPiiKey('petNickname', ['petNickname'])).toBe(true);
  });

  it('flags compound name/email/phone keys via suffix heuristic', () => {
    for (const k of ['ownerName', 'petName', 'customerName', 'ownerEmail', 'cellPhone']) {
      expect(isPiiKey(k)).toBe(true);
    }
  });

  it('does not flag technical *name keys (formName, fileName, featureName)', () => {
    for (const k of ['formName', 'fileName', 'eventName', 'featureName', 'className']) {
      expect(isPiiKey(k)).toBe(false);
    }
  });

  it('redacts a person name under a compound key end to end', () => {
    const out = sanitizeProps({ ctaId: 'claim', ownerName: 'John Doe', petName: 'Rex' });
    expect(out.ctaId).toBe('claim');
    expect(out.ownerName).toBe('[redacted]');
    expect(out.petName).toBe('[redacted]');
  });
});

describe('value heuristics', () => {
  it('detects emails', () => {
    expect(looksLikeEmail('rex.owner@example.com')).toBe(true);
    expect(looksLikeEmail('not an email')).toBe(false);
  });

  it('detects phone numbers but not short ids', () => {
    expect(looksLikePhone('+41 79 123 45 67')).toBe(true);
    expect(looksLikePhone('0791234567')).toBe(true);
    expect(looksLikePhone('12')).toBe(false);
    expect(looksLikePhone('abc')).toBe(false);
  });

  it('strips query and fragment from URLs', () => {
    expect(sanitizeUrlValue('https://fylos.me/join?email=a@b.com#x')).toBe('https://fylos.me/join');
    expect(sanitizeUrlValue('/apply?token=secret')).toBe('/apply');
  });

  it('collapses mailto and tel to the scheme only', () => {
    expect(sanitizeUrlValue('mailto:pros@fylos.me')).toBe('mailto:');
    expect(sanitizeUrlValue('tel:+41791234567')).toBe('tel:');
  });
});

describe('sanitizeProps', () => {
  it('redacts denied keys but keeps safe fields', () => {
    const out = sanitizeProps({
      ctaId: 'hero',
      name: 'John Doe',
      email: 'john@doe.com',
      message: 'please call me',
      weight: '32kg',
    });
    expect(out.ctaId).toBe('hero');
    expect(out.name).toBe(TOKEN);
    expect(out.email).toBe(TOKEN);
    expect(out.message).toBe(TOKEN);
    expect(out.weight).toBe(TOKEN);
  });

  it('redacts email/phone shaped values even under safe keys', () => {
    const out = sanitizeProps({ label: 'reach me at john@doe.com', note2: '+41 79 123 45 67' });
    expect(out.label).toBe(TOKEN);
    expect(out.note2).toBe(TOKEN);
  });

  it('strips query strings from URL-ish fields', () => {
    const out = sanitizeProps({ href: 'https://fylos.me/join?email=a@b.com' });
    expect(out.href).toBe('https://fylos.me/join');
  });

  it('redacts over-long free text', () => {
    const out = sanitizeProps({ blurb: 'x'.repeat(600) });
    expect(out.blurb).toBe(TOKEN);
  });

  it('recurses into nested objects and arrays', () => {
    const out = sanitizeProps({
      fields: ['formId', 'city'],
      nested: { email: 'a@b.com', ok: 'value' },
    });
    expect(out.fields).toEqual(['formId', 'city']);
    expect((out.nested as Record<string, unknown>).email).toBe(TOKEN);
    expect((out.nested as Record<string, unknown>).ok).toBe('value');
  });

  it('ignores prototype-polluting keys', () => {
    const raw = JSON.parse('{"__proto__":{"polluted":true},"ok":1}');
    const out = sanitizeProps(raw);
    expect(out.ok).toBe(1);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('does not mutate the input', () => {
    const input = { name: 'Jane', ctaId: 'x' };
    sanitizeProps(input);
    expect(input.name).toBe('Jane');
  });

  it('can throw instead of redacting (CI mode)', () => {
    expect(() => sanitizeProps({ email: 'a@b.com' }, { throwOnViolation: true })).toThrow();
  });

  it('reports redactions via onRedact', () => {
    const seen: string[] = [];
    sanitizeProps({ email: 'a@b.com' }, { onRedact: (i) => seen.push(i.reason) });
    expect(seen).toContain('denied_key');
  });
});
