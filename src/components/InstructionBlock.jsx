import React from 'react'

const InstructionBlock = ({ idx, opcode, name, args, active }) => (
    <div className={"instruction-block" + (active ? " active" : "")}>
        <div className="idx">{idx}</div>
        <div className="opcode">{opcode}</div>
        <div className="args">
            {args.map((arg, i) => (
                <div key={i} className="arg">{arg}</div>
            ))}
        </div>
        <div className="name">{name}</div>
    </div>
)

export default InstructionBlock

