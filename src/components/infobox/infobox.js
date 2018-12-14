import React from 'react'

class InfoBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="columns">
                <div className="column is-one-third">
                    <a target="_blank" rel="noopener noreferrer" href={this.props.info.url}>
                        <div className="box" style={{backgroundColor: this.props.info.backgroundColor}}>
                            <div className="columns ">
                                <div className="column is-one-third">
                                    <p className="image is-96x96 is-vertical-center" style={{
                                        color: this.props.info.iconColor,
                                    }}>
                                        <span className={"fab fa-" + this.props.info.icon + " fa-5x is-vertical-center"}/>
                                    </p>
                                </div>
                                <div className="column is-vertical-center">
                                    <div className={"content " + this.props.info.textSize}
                                         style={{color: this.props.info.textColor}}>
                                        {
                                            this.props.info.title
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        )
    }
}

export default InfoBox