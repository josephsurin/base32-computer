const TASK_0 = {
    id: 0,
    name: 'Add The Inputs',
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

module.exports = [
    TASK_0,
    TASK_1
]
