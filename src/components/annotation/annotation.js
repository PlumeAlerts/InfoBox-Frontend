import React from 'react'

class Annotation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <a target="_blank" rel="noopener noreferrer" href={this.props.annotation.url}>
                <div className="box" style={{backgroundColor: this.props.annotation.backgroundColor}}>
                    <div className="columns is-mobile">
                        <div className="column">
                            <p className="image is-96x96 is-vertical-center" style={{
                                color: this.props.annotation.iconColor,
                            }}>
                                <span className={"fab fa-" + this.props.annotation.icon + " fa-5x is-vertical-center"}/>
                            </p>
                        </div>
                        <div className="column is-vertical-center">
                            <div className={"content is-size-" + this.props.annotation.textSize}
                                 style={{color: this.props.annotation.textColor}}>
                                {
                                    this.props.annotation.text
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        )
    }
}

export default Annotation