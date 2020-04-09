import React, { Component } from 'react'

const MISCComputer = require('../util/misc_computer')

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code: '',
            MC: null
        }

        this.edit_code_text = this.edit_code_text.bind(this)
        this.run_code = this.run_code.bind(this)
        this.step_code = this.step_code.bind(this)
        this.restart_code = this.restart_code.bind(this)
    }

    edit_code_text(e) {
        this.setState({ code: e.target.value })
    }

    load_code() {
        try {
            var MC = new MISCComputer(this.state.code)
            this.setState({ MC })
            return MC
        } catch(e) {
            alert(e)
        }
    }

    run_code() {
        try {
            var step_interval = null
            step_interval = setInterval(() => {
                var status = this.step_code()
                if(status != 51) {
                    clearInterval(step_interval)
                }
            }, 50)
        } catch(e) {
            alert(e)
        }
    }

    step_code() {
        var MC = null
        if(!this.state.MC) {
            MC = this.load_code()
        } else {
            MC = this.state.MC
        }
        try {
            var status = MC.step()
            this.forceUpdate()
            return status
        } catch(e) {
            alert(e)
        }
    }

    restart_code() {
        this.load_code()
    }

    render() {
        let { code, MC } = this.state
        let eip = MC ? MC.get_eip() : '-'
        let status = MC ? MC.get_status() : 'OFF'
        let memory = MC ? MC.get_memory() : null
        let inputs = MC ? MC.get_inputs() : null
        let outputs = MC ? MC.get_outputs() : null
        return (
            <div className="wrapper">
                <div className="title">MISC Computer</div>
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
                <div className="graphical-area">
                    GUI
                </div>
                <div className="text-area">
                    <textarea value={code}
                        onChange={this.edit_code_text} />
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
