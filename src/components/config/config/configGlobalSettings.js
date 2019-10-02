import React from 'react'

import InputNumber from "rc-input-number"
import Authentication from "../../../util/authentication"

class ConfigGlobalSettings extends React.Component {
    constructor(props) {
        super(props)

        this.Authentication = new Authentication()
        this.twitch = window.Twitch ? window.Twitch.ext : null

        this.state = {
            dirty: false,
            user: false,
        }
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                this.Authentication.setToken(auth.token, auth.userId)
                this.Authentication.makeCall(`${process.env.REACT_APP_API_ENDPOINT}/config`).then(value => {
                    value.json().then(content => {
                        this.setState({user: content})
                        console.log(content)
                    })
                }).catch(reason => {

                })
            })
        }
    }

    onChange(c, v) {
        let user = this.state.user
        user[c] = v
        this.setState({user})
    }

    onSubmit(event) {
        event.preventDefault()
        const data = this.state.user
        this.Authentication.makeCall(`${process.env.REACT_APP_API_ENDPOINT}/config`, "PUT", JSON.stringify(data))
            .then(value => {
                value.json().then(content => {
                    this.setState({dirty: false})
                })
            })
    }

    render() {
        return (
            <div>
                <h1 className="title is-3">Global Settings</h1>
                <form onSubmit={(e) => this.onSubmit(e)}>
                    <div className="field">
                        <label className="label">Intervals</label>
                        <InputNumber name="intervals"
                                     min={1}
                                     max={120}
                                     defaultValue={15}
                                     value={this.state.user.annotation_interval}
                                     precision={0}
                                     onChange={(e) => {
                                         e = (e === undefined ? 15 : e)
                                         this.onChange('annotation_interval', e)
                                         this.setState({dirty: true})
                                     }}/>
                    </div>

                    <div className="field">
                        <div className="control">
                            <button className="button is-link" disabled={!this.state.dirty}>Save</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default ConfigGlobalSettings