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

