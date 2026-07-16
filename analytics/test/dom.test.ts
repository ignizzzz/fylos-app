import { describe, it, expect, beforeEach } from 'vitest';
import { initAutoTracking } from '../src/dom';
import type { AutoTrackingTarget } from '../src/dom';

type Call = [string, Record<string, unknown>];

function fakeTarget(): { target: AutoTrackingTarget; calls: Call[] } {
  const calls: Call[] = [];
  const target: AutoTrackingTarget = {
    track(name, props) {
      calls.push([name, props as unknown as Record<string, unknown>]);
      return true;
    },
  };
  return { target, calls };
}

describe('initAutoTracking', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('maps data-fylos-* attributes to a typed event with coercion', () => {
    const { target, calls } = fakeTarget();
    const cleanup = initAutoTracking(target);

    const a = document.createElement('a');
    a.setAttribute('data-fylos-event', 'cta_click');
    a.setAttribute('data-fylos-cta-id', 'hero_get_id');
    a.setAttribute('data-fylos-label', 'Get Rex ID');
    a.setAttribute('data-fylos-index', '3');
    document.body.appendChild(a);
    a.click();

    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toBe('cta_click');
    expect(calls[0][1]).toEqual({ ctaId: 'hero_get_id', label: 'Get Rex ID', index: 3 });
    cleanup();
  });

  it('fires when a child of the tagged element is clicked', () => {
    const { target, calls } = fakeTarget();
    const cleanup = initAutoTracking(target);
    const btn = document.createElement('button');
    btn.setAttribute('data-fylos-event', 'download_clicked');
    btn.setAttribute('data-fylos-target', 'app');
    const span = document.createElement('span');
    btn.appendChild(span);
    document.body.appendChild(btn);
    span.click();
    expect(calls[0][0]).toBe('download_clicked');
    cleanup();
  });

  it('ignores unknown event names', () => {
    const { target, calls } = fakeTarget();
    const cleanup = initAutoTracking(target);
    const el = document.createElement('div');
    el.setAttribute('data-fylos-event', 'not_a_real_event');
    document.body.appendChild(el);
    el.click();
    expect(calls).toHaveLength(0);
    cleanup();
  });

  it('cleanup detaches the listener', () => {
    const { target, calls } = fakeTarget();
    const cleanup = initAutoTracking(target);
    cleanup();
    const el = document.createElement('div');
    el.setAttribute('data-fylos-event', 'feature_viewed');
    el.setAttribute('data-fylos-feature', 'vet');
    document.body.appendChild(el);
    el.click();
    expect(calls).toHaveLength(0);
  });
});
