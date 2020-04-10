const TASK_0 = {
    id: 0,
    name: 'Add The Inputs I',
    desc: 'Read two input values, add them together, and output the result as an integer.',
    inputs: [[1, 1], [17, 31], [0, -5]],
    outputs: [[2], [48], [-5]]
}

const TASK_1 = {
    id: 1,
    name: 'Multiply The Inputs',
    desc: 'Read three input values, multiply them together, and output the result as an integer.',
    inputs: [[1,2,3], [-1,-2,-3], [0,1,2], [11,22,33]],
    outputs: [[6], [-6], [0], [7986]]
}

const TASK_2 = {
    id: 2,
    name: 'Hello, World!',
    desc: 'Write a program that outputs the ascii characters "Hello, World!"',
    inputs: [[]],
    outputs: [['H', 'e', 'l', 'l', 'o', ',', ' ', 'W', 'o', 'r', 'l', 'd', '!']]
}

const TASK_3 = {
    id: 3,
    name: 'Add The Inputs II',
    desc: 'Read an input value <code>n</code>. Then, read the next <code>n</code> input values, add them together, and output the result as an integer.',
    inputs: [[7, 1, 2, 3, 4, 5, 6, 7], [0]],
    outputs: [[28], [0]]
}

module.exports = [
    TASK_0,
    TASK_1,
    TASK_2,
    TASK_3
]
