import { useEffect, type RefObject } from 'react';

type CaseTargetState = {
  value: string;
  selectionStart: number | null;
  selectionEnd: number | null;
};

type CaseDetails = {
  targetBefore: CaseTargetState;
  eventConstructor: string;
  eventType: string;
  eventInit: EventInit | InputEventInit;
  targetAfter?: CaseTargetState;
  didPreventDefault?: boolean;
};

const isNonNullable = <T>(input: T | null): input is NonNullable<T> => (
  input != null
);

const normalizeDetails = ({
  targetBefore,
  targetAfter,
  eventConstructor,
  eventType,
  eventInit,
  didPreventDefault,
}: Partial<CaseDetails>) => {
  const result = { targetBefore };

  if (eventConstructor !== 'InputEvent') {
    Object.assign(result, { eventConstructor });
  }

  Object.assign(result, { eventType, eventInit });

  if (didPreventDefault) {
    Object.assign(result, { didPreventDefault });
  }

  if (
    targetBefore && 
    targetAfter &&
    targetBefore.value === targetAfter.value &&
    targetBefore.selectionStart === targetAfter.selectionStart &&
    targetBefore.selectionEnd === targetAfter.selectionEnd
  ) {
    Object.assign(result, { targetAfter });
  }

  return result;
};

const capture = (e: Event) => {
  const target = e.target as HTMLInputElement;

  return {
    targetBefore: {
      value: target.value,
      selectionStart: target.selectionStart,
      selectionEnd: target.selectionEnd,
    },
  };
};

const bubble = (e: Event) => {
  const target = e.target as HTMLInputElement;

  return {
    eventConstructor: Object.getPrototypeOf(e).constructor.name,
    eventType: e.type,
    eventInit: {
      inputType: (e as InputEvent).inputType,
      data: (e as InputEvent).data,
    },
    targetAfter: {
      value: target.value,
      selectionStart: target.selectionStart,
      selectionEnd: target.selectionEnd,
    },
    didPreventDefault: e.defaultPrevented,
  };
};

export const useDebug = (ref: RefObject<HTMLInputElement | null>) => {
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const current = ref.current;
    if (!current) return;

    const parentElement = current.parentElement;
    if (!parentElement) return;

    const details: [
      beforeinput: Partial<CaseDetails> | undefined,
      input: Partial<CaseDetails> | undefined,
    ] = [
      undefined,
      undefined,
    ];

    let flushClock: ReturnType<typeof setTimeout> | null = null;

    const flush = () => {
      if (!details[0] && !details[1]) return;
      console.log(
        'Collected events',
        details.filter(isNonNullable).map(normalizeDetails),
      );
      flushClock = null;
      details[0] = undefined;
      details[1] = undefined;
    };
    
    const enqueueFlush = () => {
      if (flushClock != null) return;
      flushClock = setTimeout(flush);
    };

    parentElement.addEventListener('beforeinput', (e) => {
      details[0] = capture(e);
    }, { signal, capture: true });

    parentElement.addEventListener('input', (e) => {
      details[1] = capture(e);
    }, { signal, capture: true });
    
    parentElement.addEventListener('beforeinput', (e) => {
      Object.assign(details[0]!, bubble(e));
      enqueueFlush();
    }, { signal, capture: false });

    parentElement.addEventListener('input', (e) => {
      Object.assign(details[1]!, bubble(e));
      flush();
    }, { signal, capture: false });

    return () => {
      controller.abort();
      flushClock = null;
      details[0] = undefined;
      details[1] = undefined;
    };
  }, []);
};
