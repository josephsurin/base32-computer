import React, { Component } from 'react'

const { Base32Computer, Status_Code } = require('../util/base32_computer')
const { create_ins_blocks } = require('../util/util')

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code: '',
            B32C: null,
            graphical: null,
            error_msg: ''
        }

        this.graphical_ref = React.createRef()

        this.edit_code_text = this.edit_code_text.bind(this)
        this.run_code = this.run_code.bind(this)
        this.step_code = this.step_code.bind(this)
        this.restart_code = this.restart_code.bind(this)
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

    load_code() {
        try {
            var B32C = new Base32Computer(this.state.code)
            this.setState({ B32C })
            return B32C
        } catch(e) {
            console.log('Error parsing code ' + e)
        }
    }

    run_code() {
        try {
            var step_interval = null
            step_interval = setInterval(() => {
                var status = this.step_code()
                if(status != Status_Code.EXECUTING) {
                    clearInterval(step_interval)
                }
            }, 50)
        } catch(e) {
            console.log('Runtime Error ' + e)
            this.setState({ error_msg: e.toString() })
        }
    }

    step_code() {
        var B32C = null
        if(!this.state.B32C) {
            try {
                B32C = this.load_code()
            } catch(e) {
                console.log('Step Error ' + e)
            }
        } else {
            B32C = this.state.B32C
            if(B32C.get_status() != Status_Code.EXECUTING && B32C.get_status() != Status_Code.INITIALISED) return false
        }
        try {
            var status = B32C.step()
            var eip = B32C.get_eip()
            var graphical = create_ins_blocks(this.state.code, eip)
            this.graphical_ref.current.scrollTo(0, (eip - 2) * 36)
            this.setState({ graphical })
            return status
        } catch(e) {
            console.log('Runtime Error ' + e)
            this.setState({ error_msg: e.toString() })
        }
    }

    restart_code() {
        this.load_code()
    }

    render() {
        let { code, B32C, graphical, error_msg } = this.state
        let eip = B32C ? B32C.get_eip() : '-'
        let status = B32C ? B32C.get_status() : -1
        status = Object.keys(Status_Code).find(x => Status_Code[x] == status) || 'OFF'
        let memory = B32C ? B32C.get_memory() : null
        let inputs = B32C ? B32C.get_inputs() : null
        let outputs = B32C ? B32C.get_outputs() : null

        return (
            <div className="wrapper">
                <div className="title">Base32 Computer</div>
                <div className="left-panel">
                    <div className="control-buttons">
                        <button onClick={this.run_code}>Run</button>
                        <button onClick={this.step_code}>Step</button>
                        <button onClick={this.restart_code}>Restart</button>
                        <button onClick={this.run_code}>Submit</button>
                    </div>
                    <div className="task-area">
                        Task Area
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
