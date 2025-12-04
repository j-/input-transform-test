import type { SyntheticEvent } from 'react';
import { describe, expect, it } from 'vitest';
import { unwrapEvent } from './event';

describe('unwrapEvent()', () => {
  it('returns a native event as-is', () => {
    const nativeEvent = new Event('custom');
    const actual = unwrapEvent(nativeEvent);
    expect(actual).toBe(nativeEvent);
  });

  it('returns the native event when given a synthetic event', () => {
    const nativeEvent = new Event('custom');
    const syntheticEvent: Partial<SyntheticEvent> = {
      nativeEvent,
    };
    const actual = unwrapEvent(syntheticEvent as SyntheticEvent);
    expect(actual).toBe(nativeEvent);
  });
});
