import React from 'react'
const Promise = require('bluebird')
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

export function save_task_status(task, code, solved) {
    var task_storage = localStorage.getItem('tasks')
    if(!task_storage) {
        task_storage = {}
    } else {
        task_storage = JSON.parse(task_storage)
    }
    var prev_task_status = task_storage[task]
    if(prev_task_status && prev_task_status.solved && !solved) return //current attempt fails, but we have already solved this puzzle
    var task_status = { id: task, code, solved }
    task_storage[task] = task_status
    localStorage.setItem('tasks', JSON.stringify(task_storage))
}

export function get_task_status(task) {
    var task_storage = localStorage.getItem('tasks')
    if(!task_storage) {
        return { id: task, solved: false }
    }
    task_storage = JSON.parse(task_storage)
    var task_status = task_storage[task]
    if(!task_status) {
        return { id: task, solved: false }
    }
    return task_status
}

export function sleep(ms) {
    return new Promise(res => setTimeout(res, ms))
}

// https://stackoverflow.com/a/24660323/6047350
export const promise_while = Promise.method((condition, action) => {
    if(!condition()) return
    return action().then(promise_while.bind(null, condition, action))
})
