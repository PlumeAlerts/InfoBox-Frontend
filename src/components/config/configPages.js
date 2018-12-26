import React from 'react'

import '../../assets/darkly.scss'
import ConfigContainer from "./container/configContainer";
import Authentication from "../../util/authentication";

export default class ConfigPages extends React.Component {
    constructor(props) {
        super(props);

        this.Authentication = new Authentication();

        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.state = {
            finishedLoading: false,
            light: true,
            infoBoxes: []
        }
    }

    contextUpdate(context, delta) {
        if (delta.includes('theme')) {
            this.setState(() => {
                return {light: context.theme === "light"}
            })
        }
    }

    componentDidMount() {
        // do config page setup as needed here
        if (this.twitch) {
            this.twitch.onAuthorized((auth)=>{
                this.Authentication.setToken(auth.token, auth.userId);
                if(!this.state.finishedLoading){

                    this.setState(()=>{
                        return {finishedLoading:true}
                    })
                }
                console.log(this.Authentication)
            })

            this.twitch.onContext((context, delta) => {
                this.contextUpdate(context, delta)
            });

            this.twitch.configuration.onChanged(() => {
                console.log("config")

                let config = this.twitch.configuration.broadcaster ? this.twitch.configuration.broadcaster.content : [];
                try {
                    config = JSON.parse(config)
                } catch (e) {
                    config = []
                }
                console.log(config);

                this.setState(() => {
                    return {
                        infoBoxes: config
                    }
                })
            })
        }
    }

    saveConfig(infoBoxes) {
        this.twitch.configuration.set('broadcaster', '0.0.1', JSON.stringify(infoBoxes));
        console.log(JSON.stringify(infoBoxes));
        console.log(infoBoxes)
        this.setState(prevState => {
            return {
                infoBoxes
            }
        })
    }


    render() {
        if (this.state.finishedLoading) {
            return (
                <div>
                    <ConfigContainer light={this.state.light}
                                     infoBoxes={this.state.infoBoxes}
                                     saveConfig={(info) => this.saveConfig(info)}/>
                </div>
            )
        } else {
            return (
                <div className="Config">
                    <div className={this.state.light ? 'Config-light' : 'Config-dark'}>
                        Loading...
                    </div>
                </div>
            )
        }
    }
}