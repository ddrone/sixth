# ＳＩＸＴＨ

## Overview

A simple stack-based half-assed programming language sketch based on an idea I had while being half awake. The rough idea is as follows: in a program, there are commands (that directly operate on the stack) and blocks, that during compilation extracted to separate sequences of instructions and push the instruction pointer of that sequence to the stack at run-time. Then, you can have builtin operations that take these instruction pointers in order to implement control structures.

I'm not sure whether I've learned anything, other than that I have no idea how stack-based programming languages actually work. I did manage to implement `while` as a user-space construct based on builtin `if` and recursion, but it turned out to be inconvenient to write programs with.

The other thing that I've learned is that I should probably look into established stack-based programming languages and try to writing some code in them first before trying to implement one myself.

## Running

First you'll need to grab the dependencies via

```
npm install
```

Then you can run a development server

```
npm run dev
```

There's no need for a development server, really, the whole thing is just static JS app not requiring any server support. One day I will host an instance of this thing online, maybe.
