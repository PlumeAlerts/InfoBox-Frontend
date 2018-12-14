import React from 'react'
import ReactTimeout from 'react-timeout'

import InfoBox from "../infobox/infobox";
import '../../assets/darkly.scss'

class App extends React.Component {
    constructor(props) {
        super(props);

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.state = {
            finishedLoading: false,
            theme: 'light',
            isVisible: true,
            // data: false
            data: {
                title: "Example text",
                url: "https://example.com",
                icon: {"value": "500px"},
                iconColor: {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 1
                },
                textColor: {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 1
                },
                backgroundColor: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 1
                },
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
        // if (this.state.isVisible && this.state.data !== false) {
        return (
            <InfoBox info={this.state.data}/>
        )
        // } else {
        //     return null
        // }

    }
}

export default ReactTimeout(App)