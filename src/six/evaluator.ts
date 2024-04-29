import { initState } from "./compiler.ts";
import { Program } from "./expr.ts";
import { primitiveHandlers } from "./primitives.ts";
import { VmState, pushNumber, pushFnPointer, pushBoolean, SixthError, callPointer } from "./vm_state.ts";

// Returns false if there are no further steps to be made
function stepProgram(state: VmState): boolean {
  const currBlock = state.code[state.ip.blockId];
  if (state.ip.instrId >= currBlock.length) {
    const newIp = state.flowStack.pop();
    if (newIp === undefined) {
      return false;
    }
    state.ip = newIp;
    return true;
  }

  const instr = currBlock[state.ip.instrId++];
  switch (instr.kind) {
    case 'const': {
      pushNumber(state, instr.value);
      break;
    }
    case 'call': {
      const handler = primitiveHandlers[instr.name];
      if (handler === undefined) {
        throw new SixthError(`Unknown function ${instr.name}`);
      }
      handler(state);
      break;
    }
    case 'fnPointer': {
      pushFnPointer(state, instr.value);
      break;
    }
    case 'callFnPointer': {
      callPointer(state, { blockId: instr.value, instrId: 0 });
      break;
    }
    case 'constBool': {
      pushBoolean(state, instr.value);
      break;
    }
  }

  return true;
}

function evalLoop(state: VmState) {
  while (stepProgram(state)) {
    // Do nothing extra
  }
}

export function evalEmpty(program: Program): VmState {
  const state = initState(program);
  evalLoop(state);
  return state;
}
