import { VmState, popNumber, pushNumber, popFnPointer, popBoolean, callPointer, pushBoolean, popValue, pushValue } from "./vm_state.ts";

export const primitiveHandlers: Record<string, (state: VmState) => void> = {
  '+'(state) {
    const x = popNumber(state);
    const y = popNumber(state);
    pushNumber(state, x + y);
  },
  '-'(state) {
    const x = popNumber(state);
    const y = popNumber(state);
    pushNumber(state, x - y);
  },
  'if-true'(state) {
    const fnPointer = popFnPointer(state);
    const cond = popBoolean(state);
    if (cond) {
      callPointer(state, fnPointer);
    }
  },
  'if'(state) {
    const fnPointerFalse = popFnPointer(state);
    const fnPointerTrue = popFnPointer(state);
    const cond = popBoolean(state);
    callPointer(state, cond ? fnPointerTrue : fnPointerFalse);
  },
  'call'(state) {
    const fnPointer = popFnPointer(state);
    callPointer(state, fnPointer);
  },
  '<='(state) {
    const x = popNumber(state);
    const y = popNumber(state);
    pushBoolean(state, x <= y);
  },
  '=='(state) {
    const x = popNumber(state);
    const y = popNumber(state);
    pushBoolean(state, x === y);
  },
  'swap'(state) {
    const x = popValue(state);
    const y = popValue(state);
    pushValue(state, x);
    pushValue(state, y);
  },
  'dup'(state) {
    const x = popValue(state);
    pushValue(state, x);
    pushValue(state, x);
  },
  'dup-2nd'(state) {
    const x = popValue(state);
    const y = popValue(state);
    pushValue(state, y);
    pushValue(state, x);
    pushValue(state, y);
  },
  'not'(state) {
    const x = popBoolean(state);
    pushBoolean(state, !x);
  },
  'drop'(state) {
    popValue(state);
  }
};
