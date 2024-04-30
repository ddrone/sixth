export interface ConstExpr {
  kind: 'const';
  value: number;
}

export interface ConstBoolExpr {
  kind: 'constBool';
  value: boolean;
}

export interface CallExpr {
  kind: 'call';
  name: string;
}

export interface FunRefExpr {
  kind: 'funRef';
  name: string;
}

export interface BlockExpr {
  kind: 'block';
  contents: Expr[];
}

export type Expr = ConstExpr | CallExpr | BlockExpr | ConstBoolExpr | FunRefExpr;

export function constExpr(n: number): Expr {
  return {
    kind: 'const',
    value: n
  }
}

export function call(name: string): Expr {
  return {
    kind: 'call',
    name
  }
}

export function block(...expr: Expr[]): Expr {
  return {
    kind: 'block',
    contents: expr
  }
}

export function funRef(name: string): Expr {
  return {
    kind: 'funRef',
    name
  }
}

export type FunDefs = Record<string, Expr[]>;

export interface Program {
  functions: FunDefs;
  mainCode: Expr[];
}
