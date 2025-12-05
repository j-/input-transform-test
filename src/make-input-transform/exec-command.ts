import type { MakeExecCommand } from "./types";

const execCommandTypes: Record<
  'makeExecCommandShim' | 'makeExecCommandNative',
  MakeExecCommand
> = {
  makeExecCommandShim(
    activeElement = document.activeElement,
    selectionMode = 'end',
  ) {
    return function execCommandShim(
      this: Document,
      _commandId,
      _showUI,
      value,
    ) {
      if (!(activeElement instanceof HTMLInputElement)) return false;
      if (!value) return true;
  
      const selectionStart = activeElement.selectionStart ?? value.length;
      const selectionEnd = activeElement.selectionEnd ?? value.length;
    
      console.debug('setRangeText', {
        this: this,
        activeElement,
        value,
        selectionStart,
        selectionEnd,
        selectionMode,
      });
    
      activeElement.setRangeText(
        value,
        selectionStart,
        selectionEnd,
        selectionMode,
      );
      return true;
    }
  },

  makeExecCommandNative(
    activeElement = document.activeElement,
    selectionMode = 'end',
  ) {
    return function makeExecCommand(...args) {
      if (!(activeElement instanceof HTMLInputElement)) return false;
      
      // const oldSelectionStart = activeElement.selectionStart;
      // const oldSelectionEnd = activeElement.selectionEnd;

      const result = document.execCommand.apply(document, args);
      const currentValue = activeElement.value;
      
      const selectionEnd = activeElement.selectionStart ?? currentValue.length;
      
      switch (selectionMode) {
        case 'end':
          activeElement.setSelectionRange(selectionEnd, selectionEnd);
          break;
      }
      
      return result;
    };
  },
};

export const makeExecCommandShim = execCommandTypes.makeExecCommandShim;
export const makeExecCommandNative = execCommandTypes.makeExecCommandNative;
