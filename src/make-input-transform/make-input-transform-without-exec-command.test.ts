// @vitest-environment happy-dom

import { fn, spyOn } from '@vitest/spy';
import { describe, expect, it } from 'vitest';
import { makeInputTransformWithoutExecCommand } from './make-input-transform-without-exec-command';

type CaseTargetState = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

type CaseDetails = {
  targetBefore: CaseTargetState;
  event: Event;
  targetAfter?: CaseTargetState;
  didPreventDefault?: true;
};

type Case = [
  scenario: string,
  ...details: CaseDetails[],
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
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromPaste',
          data: '1030',
        }),
      }, {
        targetBefore: {
          value: '1030',
          selectionStart: 4,
          selectionEnd: 4,
        },
        event: new InputEvent('input', {
          inputType: 'insertFromPaste',
          data: '1030',
        }),
      }],

      ['can paste valid+invalid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        }),
      }, {
        targetBefore: {
          value: 'submit by 10:30am Monday',
          selectionStart: 24,
          selectionEnd: 24,
        },
        event: new InputEvent('input', {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        }),
        targetAfter: {
          value: '1030',
          selectionStart: 4,
          selectionEnd: 4,
        },
      }],

      ['cannot paste invalid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromPaste',
          data: 'hello world',
        }),
        didPreventDefault: true,
      }],
      // #endregion

      // #region Paste into non-empty input
      ['can paste valid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromPaste',
          data: '1030',
        }),
      }, {
        targetBefore: {
          value: '99103099',
          selectionStart: 6,
          selectionEnd: 6,
        },
        event: new InputEvent('input', {
          inputType: 'insertFromPaste',
          data: '1030',
        }),
      }],

      ['can paste valid+invalid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        }),
      }, {
        targetBefore: {
          value: '99submit by 10:30am Monday99',
          selectionStart: 26,
          selectionEnd: 26,
        },
        event: new InputEvent('input', {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        }),
        targetAfter: {
          value: '99103099',
          selectionStart: 6,
          selectionEnd: 6,
        },
      }],

      ['cannot paste invalid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromPaste',
          data: 'hello world',
        }),
        didPreventDefault: true,
      }],
      // #endregion

      // #region Paste into non-empty input with selection
      ['can paste valid characters into non-empty input with selection', {
        targetBefore: {
          value: '9999',
          selectionStart: 1,
          selectionEnd: 3,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromPaste',
          data: '1030',
        }),
      }, {
        targetBefore: {
          value: '910309',
          selectionStart: 5,
          selectionEnd: 5,
        },
        event: new InputEvent('input', {
          inputType: 'insertFromPaste',
          data: '1030',
        }),
      }],

      ['can paste valid+invalid characters into non-empty input with selection', {
        targetBefore: {
          value: '9999',
          selectionStart: 1,
          selectionEnd: 3,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        }),
      }, {
        targetBefore: {
          value: '9submit by 10:30am Monday9',
          selectionStart: 24,
          selectionEnd: 24,
        },
        event: new InputEvent('input', {
          inputType: 'insertFromPaste',
          data: 'submit by 10:30am Monday',
        }),
        targetAfter: {
          value: '910309',
          selectionStart: 5,
          selectionEnd: 5,
        },
      }],

      ['cannot paste invalid characters into non-empty input with selection', {
        targetBefore: {
          value: '9999',
          selectionStart: 1,
          selectionEnd: 3,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromPaste',
          data: 'hello world',
        }),
        didPreventDefault: true,
      }],
      // #endregion

      // #region Drop into empty input
      ['can drop valid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromDrop',
          data: '2025',
        }),
      }, {
        targetBefore: {
          value: '2025',
          selectionStart: 0,
          selectionEnd: 4,
        },
        event: new InputEvent('input', {
          inputType: 'insertFromDrop',
          data: '2025',
        }),
      }],

      ['can drop valid+invalid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromDrop',
          data: '2025-12-04',
        }),
      }, {
        targetBefore: {
          value: '2025-12-04',
          selectionStart: 0,
          selectionEnd: 10,
        },
        event: new InputEvent('input', {
          inputType: 'insertFromDrop',
          data: '2025-12-04',
        }),
        targetAfter: {
          value: '20251204',
          selectionStart: 0,
          selectionEnd: 8,
        },
      }],

      ['cannot drop invalid characters into empty input', {
        targetBefore: {
          value: '',
          selectionStart: 0,
          selectionEnd: 0,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromDrop',
          data: 'hello world',
        }),
        didPreventDefault: true,
      }],
      // #endregion

      // #region Drop into non-empty input
      ['can drop valid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromDrop',
          data: '2025',
        }),
      }, {
        targetBefore: {
          value: '99202599',
          selectionStart: 2,
          selectionEnd: 6,
        },
        event: new InputEvent('input', {
          inputType: 'insertFromDrop',
          data: '2025',
        }),
      }],

      ['can drop valid+invalid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromDrop',
          data: '2025-12-04',
        }),
      }, {
        targetBefore: {
          value: '992025-12-0499',
          selectionStart: 2,
          selectionEnd: 12,
        },
        event: new InputEvent('input', {
          inputType: 'insertFromDrop',
          data: '2025-12-04',
        }),
        targetAfter: {
          value: '992025120499',
          selectionStart: 2,
          selectionEnd: 10,
        },
      }],

      ['cannot drop invalid characters into non-empty input', {
        targetBefore: {
          value: '9999',
          selectionStart: 2,
          selectionEnd: 2,
        },
        event: new InputEvent('beforeinput', {
          inputType: 'insertFromDrop',
          data: 'hello world',
        }),
        didPreventDefault: true,
      }],
      // #endregion


      // #region Autocomplete
      ['handles autocomplete with invalid characters', {
        targetBefore: {
          value: '+553121286800',
          selectionStart: 13,
          selectionEnd: 13,
        },
        event: new Event('input'),
        targetAfter: {
          value: '553121286800',
          selectionStart: 12,
          selectionEnd: 12,
        },
      }],

      ['handles autocomplete with valid characters', {
        targetBefore: {
          value: '16019521325',
          selectionStart: 11,
          selectionEnd: 11,
        },
        event: new Event('input'),
      }],
      // #endregion
    ])('%s', (_, ...detailsItems) => {      
      const target = document.createElement('input');
      target.onbeforeinput = handleBeforeInput;
      target.oninput = handleInput;

      for (const details of detailsItems) {
        const {
          targetBefore,
          targetAfter = targetBefore,
          event,
          didPreventDefault = false,
        } = details;

        Object.assign(target, targetBefore);
        const preventDefault = spyOn(event, 'preventDefault');
        target.dispatchEvent(event);
        expect(preventDefault).toHaveBeenCalledTimes(
          didPreventDefault ? 1 : 0
        );
        expect(target.value).toEqual(targetAfter.value);
        expect(target.selectionStart).toEqual(targetAfter.selectionStart);
        expect(target.selectionEnd).toEqual(targetAfter.selectionEnd);
      }
    });
  });
});
