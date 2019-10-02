import React from 'react'
import SketchPicker from "react-color/lib/Sketch"
import Select from 'react-select'
import {connect} from 'react-redux'

import Annotation from "../../../annotation/annotation"
import {defaultAnnotation, rgbaToHex} from '../../../../util/utilities'
import Authentication from "../../../../util/authentication"
import {addAnnotation, editAnnotation, setRender} from "../../../../actions"
import brands from "../../../../assets/data.json"

const colourStyles = {
    control: styles => ({...styles, backgroundColor: 'white'}),
    option: (styles,) => {
        return {
            ...styles,
            color: 'black'
        }
    },
}

let data = []
for (let icon in brands) {
    data.push({label: brands[icon].label, value: brands[icon].value})
}

const sizes = [
    {
        label: "Largest",
        value: 1,
    },
    {
        label: "Larger",
        value: 2,
    },
    {
        label: "Large",
        value: 3,
    },
    {
        label: "Normal",
        value: 4,
    },
    {
        label: "Small",
        value: 5,
    },
    {
        label: "Smaller",
        value: 6,
    },
    {
        label: "Smallest",
        value: 7,
    }
]

function getData(value) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].value === value)
            return data[i]
    }
}

function getSize(value) {
    for (let i = 0; i < sizes.length; i++) {
        if (sizes[i].value === value)
            return sizes[i]
    }
}

class ComponentAddOrEditAnnotation extends React.Component {
    constructor(props) {
        super(props)
        this.Authentication = new Authentication()
        this.twitch = window.Twitch ? window.Twitch.ext : null

        this.state = {
            annotation: this.props.annotation ? this.props.annotation : Object.assign({}, defaultAnnotation),
        }
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                this.Authentication.setToken(auth.token, auth.userId)
            })
        }
    }

    onChange(c, v) {
        let annotation = this.state.annotation
        annotation[c] = v
        this.setState({annotation})
    }


    onSubmit(event) {
        event.preventDefault()
        const data = this.state.annotation
        if (this.props.annotation) {
            this.Authentication.makeCall(`${process.env.REACT_APP_API_ENDPOINT}/annotation/config?id=${data.id}`, "PUT", JSON.stringify(data))
                .then(value => {
                    value.json().then(content => {
                        this.props.editAnnotation(content)
                        this.props.setRender(false)
                    })
                })
        } else {
            this.Authentication.makeCall(`${process.env.REACT_APP_API_ENDPOINT}/annotation/config`, "POST", JSON.stringify(data))
                .then(value => {
                    value.json().then(content => {
                        this.props.addAnnotation(content)
                        this.props.setRender(false)
                    })
                })
        }
    }

    render() {
        const customFilterOption = (option, rawInput) => {
            const words = rawInput.split(' ')
            return words.reduce(
                (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
                true,
            )
        }
        return (
            <div className="columns is-desktop">
                <div className="column">
                    <form onSubmit={(e) => this.onSubmit(e)}>
                        <div className="columns">
                            <div className="column is-two-thirds">
                                <div className="field">
                                    <label className="label">Text</label>
                                    <div className="control">
                                        <input className="input"
                                               name="text"
                                               type="text"
                                               placeholder="Text"
                                               value={this.state.annotation.text}
                                               onChange={(e) => this.onChange("text", e.target.value)}/>
                                    </div>
                                    <p className="help">30 character maximum.</p>
                                </div>
                            </div>
                            <div className="column">
                                <div className="field">
                                    <label className="label">Text Size</label>
                                    <div className="control">
                                        <Select
                                            value={getSize(this.state.annotation.textSize)}
                                            onChange={(e) => {
                                                this.onChange("textSize", e.value)
                                            }}
                                            options={sizes}
                                            styles={colourStyles}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">URL</label>
                            <div className="control">
                                <input className="input"
                                       name="url"
                                       type="text"
                                       placeholder="URL"
                                       value={this.state.annotation.url}
                                       onChange={(e) => this.onChange("url", e.target.value)}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Icons</label>
                            <div className="control">
                                <Select
                                    filterOption={customFilterOption}
                                    value={getData(this.state.annotation.icon)}
                                    onChange={(e) => {
                                        this.onChange("icon", e.value)
                                    }}
                                    options={data}
                                    styles={colourStyles}
                                />
                            </div>
                        </div>
                        <br/>
                        <h1 className="title is-4">Custom Options</h1>
                        <div className="columns">
                            <div className="column is-one-third">
                                <div className="field">
                                    <label className="label">Icon Color</label>
                                    <div className="control">
                                        <SketchPicker presetColors={[]}
                                                      disableAlpha={true}
                                                      color={this.state.annotation.iconColor}
                                                      onChangeComplete={(c) => this.onChange("iconColor", c.hex)}/>
                                    </div>
                                </div>
                            </div>

                            <div className="column is-one-third">
                                <div className="field">
                                    <label className="label">Text Color</label>
                                    <div className="control">
                                        <SketchPicker presetColors={[]}
                                                      disableAlpha={true}
                                                      color={this.state.annotation.textColor}
                                                      onChangeComplete={(c) => this.onChange("textColor", c.hex)}/>
                                    </div>
                                </div>
                            </div>

                            <div className="column is-one-third">
                                <div className="field">
                                    <label className="label">Background Color</label>
                                    <div className="control">
                                        <SketchPicker presetColors={[]}
                                                      color={this.state.annotation.backgroundColor}
                                                      onChangeComplete={(c) => this.onChange("backgroundColor", rgbaToHex(c.rgb))}/>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <br/>
                        <input className="button is-link" type="submit"
                               disabled={!this.state.annotation.text || !this.state.annotation.url || !this.state.annotation.icon}
                               value={this.props.annotation ? "Edit" : "Add"}/>
                    </form>
                </div>
                <div className="column">
                    <h1 className="title is-4">Preview:</h1>
                    {
                        <Annotation annotation={this.state.annotation}/>
                    }
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addAnnotation: (content) => dispatch(addAnnotation(content)),
        editAnnotation: (content) => dispatch(editAnnotation(content)),
        setRender: (content) => dispatch(setRender(content))
    }
}

export default connect(null, mapDispatchToProps)(ComponentAddOrEditAnnotation)