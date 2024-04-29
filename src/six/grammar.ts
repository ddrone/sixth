import { evalEmpty } from "./evaluator.ts";
import { Program, constExpr, call, block } from "./expr.ts";

const example1: Program = {
  mainCode: [
    constExpr(3),
    constExpr(4),
    constExpr(5),
    call('+'),
    call('+'),
    constExpr(12),
    call('=='),
    block(
      constExpr(1)
    ),
    call('if-true'),
  ]
};

console.log(evalEmpty(example1));
