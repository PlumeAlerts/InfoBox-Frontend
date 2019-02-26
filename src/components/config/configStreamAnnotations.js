import React from 'react'

import ConfigAnnotations from "./annotations/configAnnotations"
import ConfigGlobalSettings from "./config/configGlobalSettings"

class ConfigStreamAnnotations extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tab: true,
        }
    }

    render() {
        return (
            <div>
                <div className="columns is-desktop">
                    <div className="column"/>
                    <div className="column">
                        <h1 className="title is-3 has-text-centered">Stream Annotations</h1>
                    </div>
                    <div className="column"/>
                </div>
                <hr/>
                <div className="tabs">
                    <ul>
                        <li className={this.state.tab ? "is-active" : ""}
                            onClick={() => this.setState({tab: true})}>
                            <a>Annotations</a>
                        </li>
                        <li className={!this.state.tab ? "is-active" : ""}
                            onClick={() => this.setState({tab: false})}>
                            <a>Global Settings</a>
                        </li>
                    </ul>
                </div>
                {
                    this.state.tab ? <ConfigAnnotations/> : <ConfigGlobalSettings/>
                }
            </div>
        )
    }
}

export default ConfigStreamAnnotations