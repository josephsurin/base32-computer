import React, { Component } from 'react'

const equals = require('array-equal')

const { Base32Computer, Status_Code } = require('../util/base32_computer')
const { create_ins_blocks, save_task_status, get_task_status, promise_while, sleep } = require('../util/util')
const TASKS = require('../tasks/tasks')

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code: '',
            B32C: null,
            graphical: null,
            error_msg: '',
            task: 0,
            task_message: ''
        }

        this.graphical_ref = React.createRef()

        // Code Functions
        this.edit_code_text = this.edit_code_text.bind(this)
        this.run_code = this.run_code.bind(this)
        this.step_code = this.step_code.bind(this)
        this.submit_code = this.submit_code.bind(this)
        this.reset_code = this.reset_code.bind(this)

        // Task functions
        this.prev_task = this.prev_task.bind(this)
        this.next_task = this.next_task.bind(this)
    }

    edit_code_text(e) {
        let { graphical } = this.state
        var error_msg = ''
        try {
            graphical = create_ins_blocks(e.target.value, 0)
            error_msg = 'Character Count: ' + e.target.value.replace(/(\s|\n)/g, '').length
        } catch(e) {
            console.log('Error creating graphical instruction blocks')
            error_msg = e.toString()
        }
        this.setState({ code: e.target.value, graphical, B32C: null, error_msg })
    }

    load_code(inps) {
        return new Promise(res => {
            try {
                let { task, code } = this.state
                if(!inps) inps = TASKS[task].inputs[0]
                var B32C = new Base32Computer(code)
                B32C.send_inps(inps)
                var graphical = create_ins_blocks(code, 0)
                this.setState({ B32C, graphical }, () => {
                    return res(B32C)
                })
            } catch(e) {
                console.log('Error parsing code ' + e)
                return res(null)
            }
        })
    }

    run_code() {
        return new Promise(res => {
            try {
                var finished = false
                var B32C = null
                promise_while(() => !finished, () => {
                    return new Promise(res1 => {
                        sleep(100).then(() => {
                            this.step_code().then(b => {
                                if(!b || b.get_status() != Status_Code.EXECUTING) finished = true
                                B32C = b
                                return res1()
                            })
                        })
                    })
                }).then(() => res(B32C))
            } catch(e) {
                console.log('Runtime Error ' + e)
                this.setState({ error_msg: e.toString() })
                return res(false)
            }
        })
    }

    getB32C() {
        return new Promise(res => {
            if(this.state.B32C) return res(this.state.B32C)
            this.load_code().then(res)
        })
    }

    step_code() {
        return new Promise(res => {
            this.getB32C().then(B32C => {
                if(!B32C) return false
                if(![Status_Code.EXECUTING, Status_Code.INITIALISED, Status_Code.WAITING_FOR_INPUT].includes(B32C.get_status())) return false
                try {
                    B32C.step()
                    var eip = B32C.get_eip()
                    var graphical = create_ins_blocks(this.state.code, eip)
                    this.graphical_ref.current.scrollTo(0, (eip - 2) * 36)
                    this.setState({ B32C, graphical }, () => {
                        return res(B32C)
                    })
                } catch(e) {
                    console.log('Runtime Error ' + e)
                    this.setState({ error_msg: e.toString() })
                    return res(false)
                }
            })
        })
    }

    reset_code() {
        var graphical = create_ins_blocks(this.state.code, 0)
        this.setState({ B32C: null, graphical, task_message: '' })
    }

    submit_code() {
        let { task, code } = this.state
        var task_promises = TASKS[task].inputs.map((inps, i) => {
            return () => {
                return new Promise(res => {
                    this.load_code(inps).then(B32C => {
                        if(!B32C) return res('bad')
                        var task_message = 'Running test ' + i + '... '
                        this.setState({ B32C, task_message }, () => {
                            this.run_code().then(B32C => {
                                var passed = equals(B32C.get_outputs(), TASKS[task].outputs[i])
                                task_message += passed ? 'PASSED' : 'FAILED'
                                this.setState({ task_message }, () => {
                                    return res(passed)
                                })
                            })
                        })
                    })
                })
            }
        })
        task_promises.reduce((p, f) => p.then((r) => sleep(100).then(() => f().then(Array.prototype.concat.bind(r)))), Promise.resolve([])).then(solves => {
            var solved = solves.every(x => x)
            save_task_status(task, code, solved)
            var task_message = solved ? 'All tests PASSED' : 'Some tests FAILED'
            console.log(task_message)
            this.setState({ task_message })
        })
    }

    prev_task() {
        let { task } = this.state
        if(task == 0) return
        task -= 1
        this.setState({ task })
    }

    next_task() {
        let { task } = this.state
        if(task == TASKS.length - 1) return
        task += 1
        this.setState({ task })
    }

    render() {
        let { code, B32C, graphical, error_msg, task, task_message } = this.state
        let eip = B32C ? B32C.get_eip() : '-'
        let status = B32C ? B32C.get_status() : -1
        status = Object.keys(Status_Code).find(x => Status_Code[x] == status) || 'OFF'
        let memory = B32C ? B32C.get_memory() : null
        let inputs = B32C ? B32C.get_inputs() : null
        let outputs = B32C ? B32C.get_outputs() : null

        let task_name = TASKS[task].name
        let task_desc = TASKS[task].desc
        let task_inps = TASKS[task].inputs[0]
        let task_outs = TASKS[task].outputs[0]
        let task_status = get_task_status(task)
        let task_message_class = task_message.includes('PASSED') ? 'passed' : task_message.includes('FAILED') ? 'failed' : ''

        return (
            <div className="wrapper">
                <div className="title">Base32 Computer</div>
                <div className="left-panel">
                    <div className="control-buttons">
                        <button onClick={this.run_code}>Run</button>
                        <button onClick={this.step_code}>Step</button>
                        <button onClick={this.reset_code}>Reset</button>
                        <button onClick={this.submit_code}>Submit</button>
                    </div>
                    <div className="task-area">
                        <div className="task-details">
                            <div className="task-name">{task_name}</div>
                            <div className="task-desc">{task_desc}</div>
                            <div className="task-inps-wrapper">Example input: <br/>
                                <div className="task-inps">{JSON.stringify(task_inps)}</div>
                            </div>
                            <div className="task-outs-wrapper">Example output: <br/>
                                <div className="task-outs">{JSON.stringify(task_outs)}</div>
                            </div>
                        </div>
                        <div className="task-status">
                            <div className="task-status-wrapper">Status: <span className={"task-status-solved " + task_status.solved}>{task_status.solved ? 'Solved' : 'Not Solved'}</span>
                            </div>
                        </div>
                        <div className="control-buttons">
                            <button onClick={this.prev_task}>Prev</button>
                            <button>{task+1}/{TASKS.length}</button>
                            <button onClick={this.next_task}>Next</button>
                        </div>
                    </div>
                </div>
                <div className="graphical-area" ref={this.graphical_ref}>
                    {graphical}
                </div>
                <div className="text-area">
                    <textarea value={code}
                        onChange={this.edit_code_text} />
                    <div className="code-error">{error_msg}</div>
                </div>
                <div className="status-area">
                    <div className="status-bar">
                        <div className="status-eip">EIP: {eip}</div>
                        <div className={"task-message " + task_message_class}>{task_message}</div>
                        <div className="spacer"></div>
                        <div className="status-code">Status: {status}</div>
                    </div>
                    {!memory ? <h3 className="memory-area-not-running">Program Not Running</h3> :
                        <div className="memory-area">
                            {Object.keys(memory).map(k => (
                                <div key={k} className="memory-block">
                                    <div className="memory-loc">{k}</div>
                                    <div className="memory-val">{memory[k]}</div>
                                </div>
                            ))}
                        </div>
                    }
                    {!inputs ? null :
                        <div className="inputs-area">
                            <div className="inputs">
                                Inputs: {JSON.stringify(inputs)}
                            </div>
                        </div>
                    }
                    {!outputs ? null :
                        <div className="outputs-area">
                            <div className="outputs">
                                Outputs: {JSON.stringify(outputs)}
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
