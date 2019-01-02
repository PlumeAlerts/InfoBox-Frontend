import React from 'react'
import SketchPicker from "react-color/lib/Sketch";
import InfoBox from "../../infobox/infobox";
import {defaultInfoBox, rgbaToHex} from '../../../util/utilities'
import Select from 'react-select';
import Authentication from "../../../util/authentication";
import brands from "../../../assets/data.json"

const colourStyles = {
    control: styles => ({...styles, backgroundColor: 'white'}),
    option: (styles,) => {
        return {
            ...styles,
            color: 'black'
        };
    },
};

let data = [];
for (let icon in brands) {
    data.push({label: brands[icon].label, value: brands[icon].value});
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
];

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

class ConfigAddEdit extends React.Component {
    constructor(props) {
        super(props);
        this.Authentication = new Authentication();
        this.twitch = window.Twitch ? window.Twitch.ext : null;

        console.log("B" + this.props.info)
        this.state = {
            info: this.props.info ? this.props.info : defaultInfoBox,
        };
        console.log("A" + this.state.info)

    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                this.Authentication.setToken(auth.token, auth.userId);
            });
        }
    }

    onChange(c, v) {
        let info = this.state.info;
        info[c] = v;
        this.setState({info: info})
    }


    onSubmit(event) {
        event.preventDefault();
        const data = this.state.info;
        console.log(data)
        if (this.props.info) {
            this.Authentication.makeCall(`${process.env.REACT_APP_API_ENDPOINT}/config?id=${data.id}`, "PUT", JSON.stringify(data))
                .then(value => {
                    value.json().then(content => {
                        this.props.onEditInfo(content)
                    })
                })
        } else {
            this.Authentication.makeCall(`${process.env.REACT_APP_API_ENDPOINT}/config`, "POST", JSON.stringify(data))
                .then(value => {
                    value.json().then(content => {
                        this.props.onAddInfo(content)
                    })
                })
        }
    }

    render() {
        const customFilterOption = (option, rawInput) => {
            const words = rawInput.split(' ');
            return words.reduce(
                (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
                true,
            );
        };
        return (
            <form onSubmit={(e) => this.onSubmit(e)}>
                <div className="field">
                    <label className="label">Text</label>
                    <div className="control">
                        <input className="input"
                               name="text"
                               type="text"
                               placeholder="Text"
                               value={this.state.info.text}
                               onChange={(e) => this.onChange("text", e.target.value)}/>
                    </div>
                    <p className="help">30 character maximum.</p>
                </div>
                <div className="field">
                    <label className="label">URL</label>
                    <div className="control">
                        <input className="input"
                               name="url"
                               type="text"
                               placeholder="URL"
                               value={this.state.info.url}
                               onChange={(e) => this.onChange("url", e.target.value)}/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Icons</label>
                    <div className="control">
                        <Select
                            filterOption={customFilterOption}
                            value={getData(this.state.info.icon)}
                            onChange={(e) => {
                                this.onChange("icon", e.value);
                            }}
                            options={data}
                            styles={colourStyles}
                        />
                    </div>
                </div>
                <br/>
                <h1 className="title is-4">Custom Options</h1>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label">Icon Color</label>
                            <div className="control">
                                <SketchPicker presetColors={[]}
                                              disableAlpha={true}
                                              color={this.state.info.iconColor}
                                              onChangeComplete={(c, e) => this.onChange("iconColor", c.hex)}/>
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="field">
                            <label className="label">Text Color</label>
                            <div className="control">
                                <SketchPicker presetColors={[]}
                                              disableAlpha={true}
                                              color={this.state.info.textColor}
                                              onChangeComplete={(c, e) => this.onChange("textColor", c.hex)}/>
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="field">
                            <label className="label">Background Color</label>
                            <div className="control">
                                <SketchPicker presetColors={[]}
                                              color={this.state.info.backgroundColor}
                                              onChangeComplete={(c, e) => this.onChange("backgroundColor", rgbaToHex(c.rgb))}/>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label">Text Size</label>
                            <div className="control">
                                <Select
                                    value={getSize(this.state.info.textSize)}
                                    onChange={(e) => {
                                        this.onChange("textSize", e.value);
                                    }}
                                    options={sizes}
                                    styles={colourStyles}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="title is-4">Preview:</h1>
                {
                    <div className="columns">
                        <div className="column is-one-third">
                            <InfoBox info={this.state.info}/>
                        </div>
                    </div>
                }
                <br/>
                <input type="submit" disabled={!this.state.info.text || !this.state.info.url || !this.state.info.icon}
                       value={this.props.info ? "Edit" : "Add"}/>
            </form>
        )
    }
}

export default ConfigAddEdit