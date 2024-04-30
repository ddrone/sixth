import { evalEmpty } from "./evaluator.ts";
import { Program, constExpr, call, funRef } from "./expr.ts";

const example1: Program = {
  functions: {
    "mod": [
      call('dup'), // n n
      constExpr(0), // n n 0
      call('<='), // n (0 <= n)
      call('not'), // n !(0 <= n)
      funRef('inv'),
      call('if-true'),
    ],
    "inv": [
      constExpr(0),
      call('-')
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
