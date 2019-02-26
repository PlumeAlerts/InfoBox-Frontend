import React from 'react'
import ReactTimeout from 'react-timeout'

import Annotation from "../annotation/annotation";
import {defaultAnnotation} from '../../util/utilities'

class VideoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.state = {
            finishedLoading: false,
            theme: 'light',
            isVisible: true,
            annotation: defaultAnnotation
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
        this.setState({annotation: false})
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.listen('broadcast', (target, contentType, body) => {
                console.log(`New PubSub message!\n${target}\n${contentType}\n${body}`);
                this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`);
                try {
                    const obj = JSON.parse(body);
                    this.setState({annotation: obj});
                    this.props.setTimeout(this.clear.bind(this), 15 * 1000)
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
        if (this.state.isVisible && this.state.annotation !== undefined) {
            return (
                <Annotation annotation={this.state.annotation}/>
            )
        } else {
            return null
        }
    }
}

export default ReactTimeout(VideoComponent)