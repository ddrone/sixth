import { Instr } from "./instr.ts";
import { Value, FnPointerValue } from "./value.ts";

export interface CodePointer {
  blockId: number;
  instrId: number;
}

export interface VmState {
  code: Instr[][];
  dataStack: Value[];
  ip: CodePointer;
  flowStack: CodePointer[];
}

export class SixthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function popValue(state: VmState): Value {
  const result = state.dataStack.pop();
  if (result === undefined) {
    throw new SixthError('Stack underflow!');
  }
  return result;
}

export function pushValue(state: VmState, value: Value) {
  state.dataStack.push(value);
}

export function popNumber(state: VmState): number {
  const result = popValue(state);
  if (result.kind !== 'number') {
    throw new SixthError(`Expected number, got ${result.kind}!`);
  }
  return result.value;
}

export function popBoolean(state: VmState): boolean {
  const result = popValue(state);
  if (result.kind !== 'boolean') {
    throw new SixthError(`Expected boolean, got ${result.kind}!`);
  }
  return result.value;
}

export function popFnPointer(state: VmState): FnPointerValue {
  const result = popValue(state);
  if (result.kind !== 'fnPointer') {
    throw new SixthError(`Expected function pointer, got ${result.kind}`);
  }
  return result;
}

export function pushNumber(state: VmState, value: number) {
  pushValue(state, { kind: 'number', value });
}

export function pushBoolean(state: VmState, value: boolean) {
  pushValue(state, { kind: 'boolean', value });
}

export function pushFnPointer(state: VmState, blockId: number) {
  pushValue(state, { kind: 'fnPointer', blockId, instrId: 0 });
}

export function callPointer(state: VmState, pointer: FnPointerValue) {
  state.flowStack.push(state.ip);
  state.ip = {
    blockId: pointer.blockId,
    instrId: pointer.instrId
  }
}
