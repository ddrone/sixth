import { Expr, Program } from "./expr.ts";
import { Instr } from "./instr.ts";
import { VmState } from "./vm_state.ts";

export class Compiler {
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
      case 'constBool':
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

export function initState(program: Program): VmState {
  const compiler = new Compiler();
  const startBlock = compiler.compileToNewBlock(program.mainCode);
  return {
    code: compiler.code,
    dataStack: [],
    ip: { blockId: startBlock, instrId: 0 },
    flowStack: []
  }
}
