import type { SyntheticEvent } from 'react';
import { getEventInputData, getEventInputType, unwrapEvent } from './event';

const collectedEvents: (ReturnType<typeof serializeEvent>)[] = [];
const flushTimeoutMs = 10;

let flushClock: ReturnType<typeof setTimeout> | null = null;

const serializeTarget = (el: HTMLInputElement) => ({
  value: el.value,
  selectionStart: el.selectionStart,
  selectionEnd: el.selectionEnd,
  selectionDirection: el.selectionDirection,
});

const serializeEvent = (e: Event) => ({
  type: e.type,
  inputType: getEventInputType(e),
  data: getEventInputData(e),
  target: serializeTarget(e.target as HTMLInputElement),
  currentTarget: serializeTarget(e.currentTarget as HTMLInputElement),
});

const flush = () => {
  try {
    console.group('Collected events');
    for (const event of collectedEvents) {
      console.log(event);
    }
  } finally {
    console.groupEnd();
    flushClock = null;
    collectedEvents.splice(0);
  }
};

const enqueueFlush = () => {
  if (flushClock != null) return;
  flushClock = setTimeout(flush, flushTimeoutMs);
};

export const debugEvent = (e: Event | SyntheticEvent) => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const nativeEvent = unwrapEvent(e);
  const serializedEvent = serializeEvent(nativeEvent);
  collectedEvents.push(serializedEvent);
  enqueueFlush();
};
