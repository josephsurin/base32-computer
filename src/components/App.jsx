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
    }

    edit_code_text(e) {
        this.setState({ code: e.target.value })
    }

    run_code() {
        try {
            var MC = new MISCComputer(this.state.code)
            MC.run()
            alert(MC.get_outputs())
            alert(MC.get_memory())
        } catch(e) {
            alert(e)
        }
    }

    render() {
        let { code } = this.state
        return (
            <div className="wrapper">
                <div className="title">MISC Computer</div>
                <div className="left-panel">
                    <div className="control-buttons">
                        <button onClick={this.run_code}>Run</button>
                        <button onClick={this.run_code}>Pause</button>
                        <button onClick={this.run_code}>Step</button>
                        <button onClick={this.run_code}>Restart</button>
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
                </div>
            </div>
        )
    }
}
