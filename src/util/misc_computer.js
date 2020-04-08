const Status_Code = {
    FINISHED: 0,
    EXITED: 10,
    RUNTIME_ERROR: 1,
    INITIALISED: 50,
    EXECUTING: 51,
    WAITING_FOR_INPUT: 52
}

function add_op(mc, args) {
    let [a1, a2, a3] = args
    mc.memory[a3] = mc.memory[a1] + mc.memory[a2]
}

function sub_op(mc, args) {
    let [a1, a2, a3] = args
    mc.memory[a3] = mc.memory[a1] - mc.memory[a2]
}

function mul_op(mc, args) {
    let [a1, a2, a3] = args
    mc.memory[a3] = mc.memory[a1] * mc.memory[a2]
}

function neg_op(mc, args) {
    let [a1, a2] = args
    mc.memory[a2] = mc.memory[a1] ? 0 : 1
}

function xor_op(mc, args) {
    let [a1, a2, a3] = args
    mc.memory[a3] = mc.memory[a1] ^ mc.memory[a2]
}

function inp_op(mc, args) {
    let [a1] = args
    if(mc.input_counter >= mc.inputs.length) {
        mc.status = Status_Code.WAITING_FOR_INPUT
    } else {
        mc.memory[a1] = mc.inputs[mc.input_counter]
        mc.input_counter += 1
    }
}

function out_ascii_op(mc, args) {
    let [a1] = args
    let c = mc.memory[a1]
    if(c < 0 || c > 127) {
        mc.status = Status_Code.RUNTIME_ERROR
        throw new Error('Invalid output ASCII op: ' + c)
    }
    mc.outputs.push(String.fromCharCode(c))
}

function out_val_op(mc, args) {
    let [a1] = args
    mc.outputs.push(mc.memory[a1])
}

function lt_op(mc, args) {
    let [a1, a2, a3] = args
    mc.memory[a3] = mc.memory[a1] < mc.memory[a2] ? 1 : 0
}

function eq_op(mc, args) {
    let [a1, a2, a3] = args
    mc.memory[a3] = mc.memory[a1] == mc.memory[a2] ? 1 : 0
}

function jit_op(mc, args) {
    let [a1, a2] = args
    let Ma2 = mc.memory[a2]
    if(mc.memory[a1]) {
        if(Ma2 < 0 || Ma2 >= mc.instructions.length) {
            mc.status = Status_Code.RUNTIME_ERROR
            throw new Error('Jump destination outside of program: ' + Ma2)
        } else {
            mc.eip = Ma2 - 1
        }
    }
}

function jif_op(mc, args) {
    let [a1, a2] = args
    let Ma2 = mc.memory[a2]
    if(!mc.memory[a1]) {
        if(Ma2 < 0 || Ma2 >= mc.instructions.length) {
            mc.status = Status_Code.RUNTIME_ERROR
            throw new Error('Jump destination outside of program: ' + Ma2)
        } else {
            mc.eip = Ma2 - 1
        }
    }
}

function exit_op(mc, args) {
    mc.status = Status_Code.EXITED
}

const INSTRUCTIONS = {
    's': ['Addition', 3, add_op],
    'S': ['Subtraction', 3, sub_op],
    'M': ['Multiplication', 3, mul_op],
    '!': ['Logical Negation', 2, neg_op],
    'O': ['XOR', 3, xor_op],
    'i': ['Input', 1, inp_op],
    'o': ['Output []ASCII]', 1, out_ascii_op],
    '0': ['Output []Value]', 1, out_val_op],
    'L': ['Less Than', 3, lt_op],
    'I': ['Equals', 3, eq_op],
    'c': ['Jump If True', 2, jit_op],
    'C': ['Jump If False', 2, jif_op],
    '5': ['Exit', 0, exit_op]
}

const VALID_CHARS = 'MISCis5ocO0L!'

function parse_code(code) {
    code = code.replace(/(\s|\n)/g, '')
    var instructions = []
    var i = 0
    while(i < code.length) {
        let opcode = code[i]
        if(!INSTRUCTIONS[opcode]) {
            throw new Error('Invalid opcode ' + opcode + ' at index ' + i)
        } else {
            var nargs = INSTRUCTIONS[opcode][1]
            var args = []
            for(var j = i + 1; j < i + 1 + nargs; j++) {
                var arg = code[j]
                if(!VALID_CHARS.includes(arg)) {
                    throw new Error('Invalid char ' + arg + ' at index '+ i)
                } else {
                    args.push(arg)
                }
            }
            instructions.push([opcode, args])
            i += 1 + nargs
        }
    }
    return instructions
}

class MISCComputer {
    constructor(code) {
        this.eip = 0
        this.ic = 0
        this.input_counter = 0
        this.inputs = []
        this.outputs = []
        this.status = Status_Code.INITIALISED
        this.memory = {}
        VALID_CHARS.split('').forEach(c => this.memory[c] = 0)
        this.instructions = parse_code(code)
    }

    get_eip() {
        return this.eip
    }

    get_ic() {
        return this.ic
    }

    get_inputs() {
        return this.inputs
    }

    get_instructions() {
        return this.instructions
    }

    get_status() {
        return this.status
    }

    get_outputs() {
        return this.outputs
    }

    get_memory() {
        return this.memory
    }

    send_inps(inps) {
        this.inputs = this.inputs.concat(inps)
    }

    step() {
        this.status = Status_Code.EXECUTING
        let [co, cargs] = this.instructions[this.eip]
        let ins = INSTRUCTIONS[co]
        ins[2](this, cargs)
        if(this.status == Status_Code.WAITING_FOR_INPUT) {
            return this.status
        }
        this.ic += 1
        this.eip += 1
        if(this.eip == this.instructions.length) {
            this.status = Status_Code.FINISHED
        }
        return this.status
    }

    run() {
        this.status = Status_Code.EXECUTING
        while(this.status == Status_Code.EXECUTING) {
            this.step()
        }
        return this.status
    }
}

module.exports = MISCComputer
