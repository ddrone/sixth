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

type Value = NumberValue;

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

interface VmState {
  dataStack: Value[];
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

function evalProgram(program: Program, state: VmState) {
  for (const expr of program) {
    switch (expr.kind) {
      case 'const': {
        pushNumber(state, expr.value);
        break;
      }
      case 'call': {
        const handler = primitiveHandlers[expr.name];
        if (handler === undefined) {
          throw new SixthError(`Unknown function ${expr.name}`);
        }
        handler(state);
        break;
      }
    }
  }
}

function evalEmpty(program: Program): VmState {
  const state: VmState = {
    dataStack: []
  };
  evalProgram(program, state);
  return state;
}

console.log(evalEmpty(example1));
