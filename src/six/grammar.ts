import { evalEmpty } from "./evaluator.ts";
import { Program, constExpr, call, block } from "./expr.ts";

const example1: Program = {
  functions: {
    "mod": [
      call('dup'), // n n
      constExpr(0), // n n 0
      call('<='), // n (0 <= n)
      call('not'), // n !(0 <= n)
      block(
        constExpr(0),
        call('-')
      ),
      call('if-true'),
    ]
  },
  mainCode: [
    constExpr(-10),
    call('mod'),
    constExpr(15),
    call('mod'),
  ]
};

console.log(evalEmpty(example1));
