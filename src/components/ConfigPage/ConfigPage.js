import React from 'react'
import Authentication from '../../util/Authentication/Authentication'

import './Config.css'
import ConfigContainer from "./ConfigContainer/ConfigContainer";

export default class ConfigPage extends React.Component {
    constructor(props) {
        super(props);
        this.Authentication = new Authentication();

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.state = {
            finishedLoading: false,
            theme: 'light',
            infos: []
        }
    }

    contextUpdate(context, delta) {
        if (delta.includes('theme')) {
            this.setState(() => {
                return {theme: context.theme}
            })
        }
    }

    componentDidMount() {
        // do config page setup as needed here
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                this.Authentication.setToken(auth.token, auth.userId);
                if (!this.state.finishedLoading) {
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    this.setState(() => {
                        return {finishedLoading: true}
                    })
                }
            });

            this.twitch.onContext((context, delta) => {
                this.contextUpdate(context, delta)
            });

            this.twitch.configuration.onChanged(() => {
                let config = this.twitch.configuration.broadcaster ? this.twitch.configuration.broadcaster.content : [];
                try {
                    config = JSON.parse(config)
                } catch (e) {
                    config = []
                }

                this.setState(() => {
                    return {
                        infos: config
                    }
                })
            })
        }
    }

    saveConfig(infos) {
        this.twitch.configuration.set('broadcaster', '0.0.1', JSON.stringify(infos));

        this.setState(prevState => {
            return {
                infos
            }
        })
    }


    render() {
        if (this.state.finishedLoading && this.Authentication.isBroadcaster()) {
            return (
                <div className="Config">
                    <div className={this.state.theme === 'light' ? 'Config-light' : 'Config-dark'}>
                        <ConfigContainer infos={this.state.infos} saveConfig={(infos) => this.saveConfig(infos)}/>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="Config">
                    <div className={this.state.theme === 'light' ? 'Config-light' : 'Config-dark'}>
                        Loading...
                    </div>
                </div>
            )
        }
    }
}