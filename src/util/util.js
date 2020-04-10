import React from 'react'
const { parse_code, INSTRUCTIONS } = require('./base32_computer')
import InstructionBlock from '../components/InstructionBlock.jsx'

export function create_ins_blocks(code, active=0) {
    var parsed = parse_code(code)
    return parsed.map(([opcode, args], i) => (
        <InstructionBlock
                    key={i}
                    opcode={opcode}
                    args={args}
                    name={INSTRUCTIONS[opcode][0]}
                    active={active == i}
                    idx={i} />
    ))
}

export function get_task_status(task) {
    var task_storage = localStorage.getItem('tasks')
    if(!task_storage) {
        return { id: task, solved: false }
    }
    task_storage = JSON.parse(task_storage)
    var task_status = task_status[task]
    if(!task_status) {
        return { id: task, solved: false }
    }
    return task_status
}
