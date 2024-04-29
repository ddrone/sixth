import { VmState, popNumber, pushNumber, popFnPointer, popBoolean, callPointer, pushBoolean } from "./vm_state.ts";

export const primitiveHandlers: Record<string, (state: VmState) => void> = {
  '+'(state) {
    const x = popNumber(state);
    const y = popNumber(state);
    pushNumber(state, x + y);
  },
  'if-true'(state) {
    const fnPointer = popFnPointer(state);
    const cond = popBoolean(state);
    if (cond) {
      callPointer(state, fnPointer);
    }
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
  }
};
