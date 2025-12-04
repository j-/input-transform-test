// @vitest-environment happy-dom

import { fn, spyOn } from '@vitest/spy';
import { describe, expect, it } from 'vitest';
import { makeInputTransformWithoutExecCommand } from './make-input-transform-without-exec-command';

type CaseTargetState = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

type CaseEventDetails = InputEventInit;

type CaseDetails = {
  targetBefore: CaseTargetState;
  eventDetails: CaseEventDetails;
  targetAfter: CaseTargetState;
  didPreventDefault: boolean;
};

type Case = [
  scenario: string,
  beforeInputDetails: CaseDetails,
  inputDetails: CaseDetails | null,
];

describe('makeInputTransformWithoutExecCommand()', () => {
  describe('filtering', () => {
    const result = makeInputTransformWithoutExecCommand({
      transform: (str) => str.replace(/\D/g, ''),
    });
    
    const applyTransform = fn(result.applyTransform);
    const handleBeforeInput = fn(result.handleBeforeInput);
    const handleInput = fn(result.handleInput);

    it('applies transform function on a given input', () => {
      const input = {
        get value() {
          return 'a1b2c3';
        },
      };

      const setSpy = spyOn(input, 'value', 'set');
      
      applyTransform(input);

      expect(setSpy).toHaveBeenCalledWith('123');
    });

    it('does not apply transform function unnecessarily', () => {
      const input = {
        get value() {
          return '0000';
        },
      };

      const setSpy = spyOn(input, 'value', 'set');
      
      applyTransform(input);

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('prevents default behaviour when pressing "a"', () => {
      const beforeInputEvent = new InputEvent('beforeinput', {
        inputType: 'insertText',
        data: 'a',
      });

      const preventDefaultSpy = spyOn(beforeInputEvent, 'preventDefault');

      handleBeforeInput(beforeInputEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('does not prevent behaviour when pressing "0"', () => {
      const beforeInputEvent = new InputEvent('beforeinput', {
        inputType: 'insertText',
        data: '0',
      });

      const preventDefaultSpy = spyOn(beforeInputEvent, 'preventDefault');

      handleBeforeInput(beforeInputEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it.each<Case>([
      // #region Paste into empty input
      ['can paste valid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: '1030',
        },
        targetAfter: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        didPreventDefault: false,
      }, {
        targetBefore: {
          value: '1030',
          selectionStart: 4,
          selectionEnd: 4,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: '1030',
        },
        targetAfter: {
          value: '1030',
          selectionStart: 4,
          selectionEnd: 4,
        },
        didPreventDefault: false,
      }],

      ['can paste valid+invalid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        },
        targetAfter: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        didPreventDefault: false,
      }, {
        targetBefore: {
          value: 'submit by 10:30am Monday',
          selectionStart: 24,
          selectionEnd: 24,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        },
        targetAfter: {
          value: '1030',
          selectionStart: 4,
          selectionEnd: 4,
        },
        didPreventDefault: false,
      }],

      ['cannot paste invalid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: 'hello world',
        },
        targetAfter: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        didPreventDefault: true,
      }, null],
      // #endregion

      // #region Paste into non-empty input
      ['can paste valid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: '1030',
        },
        targetAfter: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        didPreventDefault: false,
      }, {
        targetBefore: {
          value: '99103099',
          selectionStart: 6,
          selectionEnd: 6,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: '1030',
        },
        targetAfter: {
          value: '99103099',
          selectionStart: 6,
          selectionEnd: 6,
        },
        didPreventDefault: false,
      }],

      ['can paste valid+invalid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        },
        targetAfter: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        didPreventDefault: false,
      }, {
        targetBefore: {
          value: '99submit by 10:30am Monday99',
          selectionStart: 26,
          selectionEnd: 26,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        },
        targetAfter: {
          value: '99103099',
          selectionStart: 6,
          selectionEnd: 6,
        },
        didPreventDefault: false,
      }],

      ['cannot paste invalid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: 'hello world',
        },
        targetAfter: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        didPreventDefault: true,
      }, null],
      // #endregion

      // #region Paste into non-empty input with selection
      ['can paste valid characters into non-empty input with selection', {
        targetBefore: {
          value: '9999',
          selectionStart: 1,
          selectionEnd: 3,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: '1030',
        },
        targetAfter: {
          value: '9999',
          selectionStart: 1,
          selectionEnd: 3,
        },
        didPreventDefault: false,
      }, {
        targetBefore: {
          value: '910309',
          selectionStart: 5,
          selectionEnd: 5,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: '1030',
        },
        targetAfter: {
          value: '910309',
          selectionStart: 5,
          selectionEnd: 5,
        },
        didPreventDefault: false,
      }],

      ['can paste valid+invalid characters into non-empty input with selection', {
        targetBefore: {
          value: '9999',
          selectionStart: 1,
          selectionEnd: 3,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        },
        targetAfter: {
          value: '9999',
          selectionStart: 1,
          selectionEnd: 3,
        },
        didPreventDefault: false,
      }, {
        targetBefore: {
          value: '9submit by 10:30am Monday9',
          selectionStart: 24,
          selectionEnd: 24,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        },
        targetAfter: {
          value: '910309',
          selectionStart: 5,
          selectionEnd: 5,
        },
        didPreventDefault: false,
      }],

      ['cannot paste invalid characters into non-empty input with selection', {
        targetBefore: {
          value: '9999',
          selectionStart: 1,
          selectionEnd: 3,
        },
        eventDetails: {
          inputType: 'insertFromPaste',
          data: 'hello world',
        },
        targetAfter: {
          value: '9999',
          selectionStart: 1,
          selectionEnd: 3,
        },
        didPreventDefault: true,
      }, null],
      // #endregion

      // #region Drop into empty input
      ['can drop valid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        eventDetails: {
          inputType: 'insertFromDrop',
          data: '2025',
        },
        targetAfter: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        didPreventDefault: false,
      }, {
        targetBefore: {
          value: '2025',
          selectionStart: 0,
          selectionEnd: 4,
        },
        eventDetails: {
          inputType: 'insertFromDrop',
          data: '2025',
        },
        targetAfter: {
          value: '2025',
          selectionStart: 0,
          selectionEnd: 4,
        },
        didPreventDefault: false,
      }],

      ['can drop valid+invalid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        eventDetails: {
          inputType: 'insertFromDrop',
          data: '2025-12-04',
        },
        targetAfter: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        didPreventDefault: false,
      }, {
        targetBefore: {
          value: '2025-12-04',
          selectionStart: 0,
          selectionEnd: 10,
        },
        eventDetails: {
          inputType: 'insertFromDrop',
          data: '2025-12-04',
        },
        targetAfter: {
          value: '20251204',
          selectionStart: 0,
          selectionEnd: 8,
        },
        didPreventDefault: false,
      }],

      ['cannot drop invalid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        eventDetails: {
          inputType: 'insertFromDrop',
          data: 'hello world',
        },
        targetAfter: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        didPreventDefault: true,
      }, null],
      // #endregion

      // #region Drop into non-empty input
      ['can drop valid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        eventDetails: {
          inputType: 'insertFromDrop',
          data: '2025',
        },
        targetAfter: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        didPreventDefault: false,
      }, {
        targetBefore: {
          value: '99202599',
          selectionStart: 2,
          selectionEnd: 6,
        },
        eventDetails: {
          inputType: 'insertFromDrop',
          data: '2025',
        },
        targetAfter: {
          value: '99202599',
          selectionStart: 2,
          selectionEnd: 6,
        },
        didPreventDefault: false,
      }],

      ['can drop valid+invalid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        eventDetails: {
          inputType: 'insertFromDrop',
          data: '2025-12-04',
        },
        targetAfter: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        didPreventDefault: false,
      }, {
        targetBefore: {
          value: '992025-12-0499',
          selectionStart: 2,
          selectionEnd: 12,
        },
        eventDetails: {
          inputType: 'insertFromDrop',
          data: '2025-12-04',
        },
        targetAfter: {
          value: '992025120499',
          selectionStart: 2,
          selectionEnd: 10,
        },
        didPreventDefault: false,
      }],

      ['cannot drop invalid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        eventDetails: {
          inputType: 'insertFromDrop',
          data: 'hello world',
        },
        targetAfter: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        didPreventDefault: true,
      }, null],
      // #endregion
    ])('%s', (_, beforeInputDetails, inputDetails) => {
      const target = document.createElement('input');

      Object.assign(target, beforeInputDetails.targetBefore);
      const beforeInputEvent = new InputEvent('beforeinput', beforeInputDetails.eventDetails);
      const beforeInputPreventDefault = spyOn(beforeInputEvent, 'preventDefault');

      target.onbeforeinput = handleBeforeInput;
      target.dispatchEvent(beforeInputEvent);

      expect(beforeInputPreventDefault).toHaveBeenCalledTimes(
        beforeInputDetails.didPreventDefault ? 1 : 0
      );
      expect(target.value).toEqual(beforeInputDetails.targetAfter.value);
      expect(target.selectionStart).toEqual(beforeInputDetails.targetAfter.selectionStart);
      expect(target.selectionEnd).toEqual(beforeInputDetails.targetAfter.selectionEnd);

      if (inputDetails) {
        Object.assign(target, inputDetails.targetBefore);
        const inputEvent = new InputEvent('input', inputDetails.eventDetails);
        const inputPreventDefault = spyOn(inputEvent, 'preventDefault');

        target.oninput = handleInput;
        target.dispatchEvent(inputEvent);

        expect(inputPreventDefault).toHaveBeenCalledTimes(
          inputDetails.didPreventDefault ? 1 : 0
        );
        expect(target.value).toEqual(inputDetails.targetAfter.value);
        expect(target.selectionStart).toEqual(inputDetails.targetAfter.selectionStart);
        expect(target.selectionEnd).toEqual(inputDetails.targetAfter.selectionEnd);
      }
    });

    it('handles autocomplete with invalid characters', () => {
      const target = document.createElement('input');
      target.value = '+553121286800';
      target.selectionStart = 13;
      target.selectionEnd = 13;

      const event = new Event('input');

      target.oninput = handleInput;
      target.dispatchEvent(event);

      expect(target.value).toEqual('553121286800');
      expect(target.selectionStart).toEqual(12);
      expect(target.selectionEnd).toEqual(12);
    });

    it('handles autocomplete with valid characters', () => {
      const target = document.createElement('input');
      target.value = '16019521325';
      target.selectionStart = 11;
      target.selectionEnd = 11;

      const event = new Event('input');

      target.oninput = handleInput;
      target.dispatchEvent(event);

      expect(target.value).toEqual('16019521325');
      expect(target.selectionStart).toEqual(11);
      expect(target.selectionEnd).toEqual(11);
    });
  });
});
