import { ConstExpr, CallExpr, ConstBoolExpr } from "./expr.ts";

export interface FnPointerInstr {
  kind: 'fnPointer';
  value: number;
}

export interface CallPointerInstr {
  kind: 'callFnPointer';
  value: number;
}

export type Instr = ConstExpr | CallExpr | FnPointerInstr | ConstBoolExpr | CallPointerInstr;
