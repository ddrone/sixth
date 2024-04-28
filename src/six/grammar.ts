interface ConstExpr {
  kind: 'const';
  value: number;
}

interface CallExpr {
  kind: 'call';
  name: string;
}

interface BlockExpr {
  kind: 'block';
  contents: Expr[];
}

type Expr = ConstExpr | CallExpr | BlockExpr;

function constExpr(n: number): Expr {
  return {
    kind: 'const',
    value: n
  }
}

function call(name: string): Expr {
  return {
    kind: 'call',
    name
  }
}

interface NumberValue {
  kind: 'number';
  value: number;
}

interface FnPointerValue {
  kind: 'fnPointer';
  blockId: number;
  instrId: number;
}

type Value = NumberValue | FnPointerValue;

interface FnPointerInstr {
  kind: 'fnPointer';
  value: number;
}

type Instr = ConstExpr | CallExpr | FnPointerInstr;

class Compiler {
  code: Instr[][] = [];
  nextBlock: number = 0;

  compileToNewBlock(exprs: Expr[]): number {
    const result = this.nextBlock++;
    const newBlock: Instr[] = [];
    this.code.push(newBlock);

    for (const expr of exprs) {
      newBlock.push(this.compileExpr(expr));
    }

    return result;
  }

  compileExpr(expr: Expr): Instr {
    switch (expr.kind) {
      case 'const':
        return expr;
      case 'call':
        return expr;
      case 'block': {
        const blockId = this.compileToNewBlock(expr.contents);
        return {
          kind: 'fnPointer',
          value: blockId
        }
      }
    }
  }
}

interface CodePointer {
  blockId: number;
  instrId: number;
}

interface VmState {
  code: Instr[][];
  dataStack: Value[];
  ip: CodePointer;
  flowStack: CodePointer[];
}

function initState(program: Program): VmState {
  const compiler = new Compiler();
  const startBlock = compiler.compileToNewBlock(program);
  return {
    code: compiler.code,
    dataStack: [],
    ip: { blockId: startBlock, instrId: 0 },
    flowStack: []
  }
}

class SixthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function popValue(state: VmState): Value {
  const result = state.dataStack.pop();
  if (result === undefined) {
    throw new SixthError('Stack underflow!');
  }
  return result;
}

function pushValue(state: VmState, value: Value) {
  state.dataStack.push(value);
}

function popNumber(state: VmState): number {
  const result = popValue(state);
  if (result.kind !== 'number') {
    throw new SixthError(`Expected number, got ${result.kind}`)!
  }
  return result.value;
}

function pushNumber(state: VmState, value: number) {
  pushValue(state, { kind: 'number', value });
}

function pushFnPointer(state: VmState, blockId: number) {
  pushValue(state, { kind: 'fnPointer', blockId, instrId: 0 });
}

const primitiveHandlers: Record<string, (state: VmState) => void> = {
  '+'(state) {
    const x = popNumber(state);
    const y = popNumber(state);
    pushNumber(state, x + y);
  }
};

type Program = Expr[];

const example1: Program = [
  constExpr(3),
  constExpr(4),
  constExpr(5),
  call('+'),
  call('+')
];

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

  const instr = currBlock[state.ip.instrId];
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
  }

  state.ip.instrId++;
  return true;
}

function evalLoop(state: VmState) {
  while (stepProgram(state)) {
    // Do nothing extra
  }
}

function evalEmpty(program: Program): VmState {
  const state = initState(program);
  evalLoop(state);
  return state;
}

console.log(evalEmpty(example1));
