import { evalEmpty } from "./evaluator.ts";
import { Program, constExpr, call, funRef, block, constBool } from "./expr.ts";

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
    ],
    "do-while": [
      call('dup'),
      call('call'),
      block(
        call('do-while'),
      ),
      block(
        call('drop')
      ),
      call('if')
    ],
    "sum": [
      constExpr(0), // n sum
      block(
        call('dup-2nd'),
        constExpr(0),
        call('=='),
        block(
          call('dup-2nd'),
          call('+'),
          call('swap'),
          constExpr(1),
          call('swap'),
          call('-'),
          call('swap'),
          constBool(true),
        ),
        block(
          constBool(false),
        )
      ),
      call('do-while'),
      call('swap'),
      call('drop'),
    ]
  },
  mainCode: [
    constExpr(-10),
    call('mod'),
    constExpr(15),
    call('mod'),
    constExpr(10),
    call('sum'),
  ]
};

console.log(evalEmpty(example1));
