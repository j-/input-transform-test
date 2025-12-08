import { PHASE_TARGET } from './constants';
import type { EventPhase, TargetPhase } from './types';

type EventForPhase<P extends EventPhase, T> =
  P extends TargetPhase
    ? { currentTarget: T }
    : { target: T };

export function getEventTarget<
  P extends EventPhase,
  T extends EventTarget | null,
>(
  event: EventForPhase<P, T>,
  phase: P,
): T {
  const e = event as { currentTarget?: T; target?: T };
  return (phase === PHASE_TARGET ? e.currentTarget : e.target) as T;
}
