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
            data: false
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

    clear() {
        this.setState({data: false})
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.listen('broadcast', (target, contentType, body) => {
                console.log(`New PubSub message!\n${target}\n${contentType}\n${body}`);
                this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`);
                try {
                    const obj = JSON.parse(body);
                    this.setState({data: obj});
                    this.props.setTimeout(this.clear.bind(this), obj.duration * 1000)
                } catch (ex) {
                    console.error(ex);
                }

            });

            this.twitch.onVisibilityChanged((isVisible, _c) => {
                this.visibilityChanged(isVisible)
            });

            this.twitch.onContext((context, delta) => {
                this.contextUpdate(context, delta)
            })
        }
    }

    componentWillUnmount() {
        if (this.twitch) {
            this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
        }
    }

    render() {
        if (this.state.isVisible && this.state.data !== false) {
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