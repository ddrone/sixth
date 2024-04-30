import { Expr, Program } from "./expr.ts";
import { CallPointerInstr, FnPointerInstr, Instr } from "./instr.ts";
import { primitiveHandlers } from "./primitives.ts";
import { VmState } from "./vm_state.ts";

export class CompileError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class Compiler {
  code: Instr[][] = [];
  nextBlock: number = 0;
  program: Program;
  unresolvedReferences: Map<string, (FnPointerInstr | CallPointerInstr)[]> = new Map();

  constructor(program: Program) {
    this.program = program;
  }

  compileAll(): number {
    const funRefs = new Map<string, number>();
    for (const [funName, code] of Object.entries(this.program.functions)) {
      funRefs.set(funName, this.compileToNewBlock(code));
    }

    const result = this.compileToNewBlock(this.program.mainCode);

    for (const [funName, refs] of this.unresolvedReferences.entries()) {
      const refValue = funRefs.get(funName);
      if (refValue === undefined) {
        throw new Error(`Compiler internal error: not found reference value for ${funName}`);
      }

      for (const ref of refs) {
        ref.value = refValue;
      }
    }

    return result;
  }

  compileToNewBlock(exprs: Expr[]): number {
    const result = this.nextBlock++;
    const newBlock: Instr[] = [];
    this.code.push(newBlock);

    for (const expr of exprs) {
      newBlock.push(this.compileExpr(expr));
    }

    return result;
  }

  saveRef(funName: string, instr: FnPointerInstr | CallPointerInstr) {
    const arr = this.unresolvedReferences.get(funName);
    if (arr === undefined) {
      this.unresolvedReferences.set(funName, [instr]);
    }
    else {
      arr.push(instr);
    }
  }

  compileExpr(expr: Expr): Instr {
    switch (expr.kind) {
      case 'const':
        return expr;
      case 'call': {
        if (expr.name in primitiveHandlers) {
          return expr;
        }
        else if (expr.name in this.program.functions) {
          const result: CallPointerInstr = {
            kind: 'callFnPointer',
            value: -1
          };
          this.saveRef(expr.name, result);
          return result;
        }
        else {
          throw new CompileError(`Unresolved reference to function ${expr.name}!`);
        }
      }
      case 'constBool':
        return expr;
      case 'funRef': {
        if (!(expr.name in this.program.functions)) {
          throw new CompileError(`Unresolved reference to function ${expr.name}!`);
        }
        const result: FnPointerInstr = {
          kind: 'fnPointer',
          value: -1
        }
        this.saveRef(expr.name, result);
        return result;
      }
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

export function initState(program: Program): VmState {
  const compiler = new Compiler(program);
  const startBlock = compiler.compileAll();
  return {
    code: compiler.code,
    dataStack: [],
    ip: { blockId: startBlock, instrId: 0 },
    flowStack: []
  }
}
