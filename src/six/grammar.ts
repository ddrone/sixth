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
      call('dup'), // body body
      call('call'), // body finished
      block(
        call('do-while')
      ),
      block(
        call('drop')
      ),
      call('if')
    ],
    "sum": [
      constExpr(0), // n 0
      block(
        call('dup-2nd'), // n sum n
        constExpr(0), // n sum n 0
        call('=='), // n sum (n == 0)
        block(
          call('dup-2nd'), // n sum n
          call('+'), // n (sum + n)
          call('swap'), // (sum + n) n
          constExpr(1), // (sum + n) n 1
          call('swap'), // (sum + n) 1 n
          call('-'), // (sum + n) (n - 1)
          call('swap'), // (n - 1) (sum + n)
          constBool(true), // (n - 1) (sum + n) true
        ),
        block(
          constBool(false), // n sum false
        )
      ), // n 0 loop-fun
      call('do-while'), // 0 sum
      call('swap'), // sum 0
      call('drop'), // sum
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
