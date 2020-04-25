# Base32 Computer Programming Puzzles

The Base32 Computer reads and executes `b32 programs`. A `b32 program` is a string of characters made up of the characters in the standard base32 alphabet `ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`. The Base32 Computer has 32 registers which it can read/write data to. Each register is identified by a character in the base32 alphabet and at the start of execution, all registers have the value `0`.

The syntax for a `b32 program` follows the following structure:

```
[opcode][arg1][arg2][opcode][arg1][arg2][arg3][opcode][arg1]...
```

and there can be any amount of whitespace between each character.

Each `(opcode, args)` pair form an instruction. Instructions are labeled by their index to be used by jump instructions. The first instruction has an index of `0` and the last instruction has an index of `n-1`, where `n` is the total number of instructions.

List of opcodes:

|Opcode|Instruction|#Args|Args|Description|
|---|---|---|---|---|
|`A`|Addition|3|`a1` `a2` `a3`| Stores the result of `a1` + `a2` in `a3` |
|`S`|Subtraction|3|`a1` `a2` `a3`| Stores the result of `a1` - `a2` in `a3` |
|`M`|Multiplication|3|`a1` `a2` `a3`| Stores the result of `a1` * `a2` in `a3` |
|`N`|Logical Negation|2|`a1` `a2`| Stores the result of `not a1` in `a3` |
|`X`|XOR|3|`a1` `a2` `a3`| Stores the result of `a1` XOR `a2` in `a3` |
|`I`|Input|1|`a1`| Reads user input and stores it in `a1` |
|`O`|Output (ASCII)|1|`a1`| Outputs `a1` as an ASCII value |
|`V`|Output (Value)|1|`a1`| Outputs `a1` as an decimal value |
|`L`|Less Than|3|`a1` `a2` `a3`| Stores the result of `a1 < a2` in `a3` |
|`E`|Equals|3|`a1` `a2` `a3`| Stores the result of `a1 = a2` in `a3` |
|`T`|Jump If True|2|`a1` `a2`| Jumps to the instruction at index `a2` if `a1` is nonzero |
|`F`|Jump If False|2|`a1` `a2`| Jumps to the instruction at index `a2` if `a1` is zero |
|`Q`|Quit|0|| Exits the program|

Example program to add two user inputted numbers and output the result:

```
IA
IB
AABA
VA
```
