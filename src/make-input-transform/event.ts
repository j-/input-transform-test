import type { SyntheticEvent } from 'react';
import {
  COMMAND_HISTORY_REDO,
  COMMAND_HISTORY_UNDO,
  COMMAND_INSERT_FROM_DROP,
  COMMAND_INSERT_FROM_PASTE,
  COMMAND_INSERT_REPLACEMENT_TEXT,
  COMMAND_INSERT_TEXT,
} from './constants';

export const isCommandHistoryRedo = (
  command: string
): command is typeof COMMAND_HISTORY_REDO =>
  command === COMMAND_HISTORY_REDO;

export const isCommandHistoryUndo = (
  command: string
): command is typeof COMMAND_HISTORY_UNDO =>
  command === COMMAND_HISTORY_UNDO;

export const isCommandInsertFromDrop = (
  command: string
): command is typeof COMMAND_INSERT_FROM_DROP =>
  command === COMMAND_INSERT_FROM_DROP;

export const isCommandInsertFromPaste = (
  command: string
): command is typeof COMMAND_INSERT_FROM_PASTE =>
  command === COMMAND_INSERT_FROM_PASTE;

export const isCommandInsertReplacementText = (
  command: string
): command is typeof COMMAND_INSERT_REPLACEMENT_TEXT =>
  command === COMMAND_INSERT_REPLACEMENT_TEXT;

export const isCommandInsertText = (
  command: string
): command is typeof COMMAND_INSERT_TEXT =>
  command === COMMAND_INSERT_TEXT;

export const getEventInputType = (
  event: Event
): string | undefined => (event as InputEvent).inputType;

export const getEventInputData = (
  event: Event
): string | null => (event as InputEvent).data;

// Do not use `instanceof` since the proto may lie.
export const isInputEvent = (
  event: Event
): event is InputEvent & { inputType: string; } =>
  // Must be one of these event types.
  (event.type === 'input' || event.type === 'beforeinput') &&
  // Must have an input type.
  getEventInputType(event) != null;

export const isTextInputEvent = (event: Pick<Event, 'type'>): boolean =>
  event.type === 'textInput';

export const getInputEventInputType = <T extends Pick<InputEvent, 'inputType'>>(
  event: T
): T['inputType'] => event.inputType;

export const getInputEventInputData = <T extends Pick<InputEvent, 'data'>>(
  event: T
): T['data'] => event.data;
  
export const isInsertFromDropEvent = (
  event: Event
): event is InputEvent & { inputType: typeof COMMAND_INSERT_FROM_DROP; data: string; } =>
  isInputEvent(event) && isCommandInsertFromDrop(event.inputType);

export const isInsertFromPasteEvent = (
  event: Event
): event is InputEvent & { inputType: typeof COMMAND_INSERT_FROM_PASTE; data: string; } =>
  isInputEvent(event) && isCommandInsertFromPaste(event.inputType);

export const isInsertReplacementTextEvent = (
  event: Event
): event is InputEvent & { inputType: typeof COMMAND_INSERT_REPLACEMENT_TEXT; data: string; } =>
  isInputEvent(event) && isCommandInsertReplacementText(event.inputType);

export const isInsertTextEvent = (
  event: Event
): event is InputEvent & { inputType: typeof COMMAND_INSERT_TEXT; data: string; } =>
  isInputEvent(event) && isCommandInsertText(event.inputType);

export const isHistoryRedoEvent = (
  event: Event
): event is InputEvent & { inputType: typeof COMMAND_HISTORY_REDO; data: string; } =>
  isInputEvent(event) && isCommandHistoryRedo(event.inputType);

export const isHistoryUndoEvent = (
  event: Event
): event is InputEvent & { inputType: typeof COMMAND_HISTORY_UNDO; data: string; } =>
  isInputEvent(event) && isCommandHistoryUndo(event.inputType);

export const isHistoryEvent = (
  event: Event
): event is InputEvent & { inputType: typeof COMMAND_HISTORY_REDO | typeof COMMAND_HISTORY_UNDO; data: string; } =>
  isInputEvent(event) && (isCommandHistoryRedo(event.inputType) || isCommandHistoryUndo(event.inputType));

export function unwrapEvent<T extends Event>(nativeEvent: T): T;
export function unwrapEvent<T extends SyntheticEvent>(syntheticEvent: T): T['nativeEvent'];
export function unwrapEvent(maybeSyntheticEvent: Event | SyntheticEvent): Event;
export function unwrapEvent(maybeSyntheticEvent: Event | SyntheticEvent): Event {
  const nativeEvent = (maybeSyntheticEvent as SyntheticEvent).nativeEvent;
  return nativeEvent ?? maybeSyntheticEvent;
}
