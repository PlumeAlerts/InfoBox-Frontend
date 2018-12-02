import React from 'react'
import ReactTimeout from 'react-timeout'

import './App.scss'

class App extends React.Component {
    constructor(props) {
        super(props);

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.state = {
            finishedLoading: false,
            theme: 'light',
            isVisible: true,
            //TODO Temp data
            data: {
                title: "Twitter",
                iconUrl: "https://localhost.rig.twitch.tv:8080/Twitter_Logo_Blue.svg",
                url: "https://twitter.com/lclc98",
                description: "Checkout my twitter",
                duration: 10,
                interval: 60,
            }
        };
    }

    contextUpdate(context, delta) {
        if (delta.includes('theme')) {
            this.setState(() => {
                return {theme: context.theme}
            })
        }
    }

    visibilityChanged(isVisible) {
        this.setState(() => {
            return {
                isVisible
            }
        })
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.listen('broadcast', (target, contentType, body) => {
                this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`);
                this.props.setTimeout(this.setState({data: null}), this.state.data.duration)

            });

            this.twitch.onVisibilityChanged((isVisible, _c) => {
                this.visibilityChanged(isVisible)
            });

            this.twitch.onContext((context, delta) => {
                this.contextUpdate(context, delta)
            })
        }

        this.props.setTimeout(() => {
            this.setState({data: null})
        }, this.state.data.duration * 1000)

    }

    componentWillUnmount() {
        if (this.twitch) {
            this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
        }
    }

    render() {
        if (this.state.isVisible && this.state.data !== null) {
            return (
                <a href={this.state.data.url} target="_blank">
                    <div className='media'>
                        <div className="media-left">
                            <figure className="image is-48x48">
                                <img src={this.state.data.iconUrl} alt="Placeholder image"/>
                            </figure>
                        </div>
                        <div className='media-content'>
                            <p className={"title is-5" + (this.state.theme === 'light' ? ' has-text-dark' : ' has-text-light')}>{this.state.data.title}</p>
                            <p className={"subtitle is-6" + (this.state.theme === 'light' ? ' has-text-dark' : ' has-text-light')}>{this.state.data.description}</p>
                        </div>
                    </div>
                </a>
            )
        } else {
            return (
                <div className="App">
                </div>
            )
        }

    }
}

export default ReactTimeout(App)