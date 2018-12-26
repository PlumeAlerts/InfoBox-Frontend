import React from 'react'
import Select from "react-select";
import SketchPicker from "react-color/lib/Sketch";
import InfoBox from "../../infobox/infobox";
import {rgbaToHex, defaultInfoBox} from '../../../util/utilities'

const colourStyles = {
    control: styles => ({...styles, backgroundColor: 'white'}),
    option: (styles,) => {
        return {
            ...styles,
            color: 'black'
        };
    },
};

class ConfigAddEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            iconSelected: this.props.data[0],
            textSizeSelected: {
                label: "Normal",
                value: "4",
            },

            info: {
                ...defaultInfoBox,
                ...this.props.info,
            },

            sizes: [
                {
                    label: "Largest",
                    value: "1",
                },
                {
                    label: "Larger",
                    value: "2",
                },
                {
                    label: "Large",
                    value: "3",
                },
                {
                    label: "Normal",
                    value: "4",
                },
                {
                    label: "Small",
                    value: "5",
                },
                {
                    label: "Smaller",
                    value: "6",
                },
                {
                    label: "Smallest",
                    value: "7",
                }
            ]
        };
    }

    onChange(c, v) {
        let info = this.state.info;
        info[c] = v;
        this.setState({info: info})
    }


    onSubmit(event) {
        event.preventDefault();
        const data = this.state.info
        this.props.onAddInfo(data)
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
                    <label className="label">Title</label>
                    <div className="control">
                        <input className="input"
                               name="title"
                               type="text"
                               placeholder="Title"
                               onChange={(e) => this.onChange("title", e.target.value)}/>
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
                               onChange={(e) => this.onChange("url", e.target.value)}/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Icons</label>
                    <div className="control">
                        <Select
                            filterOption={customFilterOption}
                            value={this.state.iconSelected}
                            onChange={(e) => {
                                this.onChange("icon", e.value);
                                this.setState({iconSelected: e})
                            }}
                            options={this.props.data}
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
                                    value={this.state.textSizeSelected}
                                    onChange={(e) => {
                                        this.onChange("textSize", e.value);
                                        this.setState({textSizeSelected: e})
                                    }}
                                    options={this.state.sizes}
                                    styles={colourStyles}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="title is-4">Preview:</h1>
                {
                    this.state.info ? (
                        <InfoBox info={this.state.info}/>
                    ) : null
                }
                <br/>
                <input type="submit" disabled={!this.state.info.title || !this.state.info.url || !this.state.info.icon}
                       value="Add"/>
            </form>
        )
    }
}

export default ConfigAddEdit