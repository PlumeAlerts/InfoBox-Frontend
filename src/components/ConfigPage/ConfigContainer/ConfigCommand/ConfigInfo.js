import React from 'react'
import './ConfigInfo.css'

export default class ConfigInfo extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="config-infos-container">
                <div className="config-infos-actions" onClick={() => this.props.delete(this.props.infoKey)}>
                    Delete
                </div>
                <div className="config-infos-info">
                    Title: {this.props.info.title}<br/>
                    Description: {this.props.info.description}
                </div>
            </div>
        )
    }
}