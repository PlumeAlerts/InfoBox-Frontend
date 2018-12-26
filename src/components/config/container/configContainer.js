import React from 'react'

import '../../../assets/darkly.scss'
import InputNumber from "rc-input-number";
import ConfigAddEdit from "./configAddEdit";
import InfoBox from "../../infobox/infobox";
import brands from "../../../assets/data.json"
let data = [];

const defaultConfig = {
    info: [],
    interval: 15
};

class ConfigContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            infoBoxes: {
                ...defaultConfig,
                ...this.props.infoBoxes,
            },
            tab: false,

            dirty: false,
            addEditInfo: false,
        };

        for (let icon in brands) {
            data.push({label: brands[icon].label, value: brands[icon].value});
        }

    }

    onChange(c, v) {
        let info = this.state.infoBoxes;
        info[c] = v;
        this.setState({infoBoxes: info})
    }

    onAddInfo(data) {
        this.setState({addEditInfo: false});

        this.setState(prevState => {
            let infoBoxes = prevState.infoBoxes;
            infoBoxes.info.push(data);
            return {
                infoBoxes
            }
        }, () => this.props.saveConfig(this.state.infoBoxes));

    }

    onSubmit(event) {
        event.preventDefault();

        this.props.saveConfig(this.state.infoBoxes)
    }

    renderInfoBoxes() {
        return (
            <div>
                <nav className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <h1 className="title is-3">InfoBoxes</h1>
                        </div>
                    </div>

                    <div className="level-right">
                        <p className="level-item">
                            {
                                !this.state.addEditInfo ?
                                    <a className="button is-link"
                                       onClick={(e) => this.setState({
                                           addEditInfo: (
                                               <ConfigAddEdit onAddInfo={(e) => this.onAddInfo(e)} data={null}/>)
                                       })}>
                                        Add
                                    </a>
                                    : null
                            }
                        </p>
                    </div>
                </nav>

                {
                    this.state.addEditInfo ? (
                        <ConfigAddEdit onAddInfo={(e) => this.onAddInfo(e)} data={data}/>
                    ) : (
                        <div>
                            <h1 className="title is-4">InfoBoxes List</h1>
                            {this.state.infoBoxes.info.map(function (info, index) {
                                return (
                                    <InfoBox key={index} info={info}/>
                                );
                            })}
                        </div>
                    )
                }
            </div>
        )
    }

    renderGlobalSettings() {
        return (
            <div>
                {/*TODO on submit if undefined reset to 15*/}
                <h1 className="title is-3">Global Settings</h1>
                <form onSubmit={(e) => this.onSubmit(e)}>
                    <div className="field">
                        <label className="label">Intervals</label>
                        <InputNumber name="intervals"
                                     min={1}
                                     max={120}
                                     defaultValue={15}
                                     value={this.state.infoBoxes.interval}
                                     precision={0}
                                     onChange={(e) => {
                                         this.onChange('interval', e);
                                         this.setState({dirty: true})
                                     }}/>
                    </div>

                    <div className="field">
                        <div className="control">
                            <button className="button is-link" disabled={!this.state.dirty}>Save</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    render() {
        return (
            <div>
                <div className="tabs">
                    <ul>
                        <li className={!this.state.tab ? "is-active" : ""}
                            onClick={() => this.setState({tab: false})}>
                            <a>InfoBoxes</a>
                        </li>
                        <li className={this.state.tab ? "is-active" : ""}
                            onClick={() => this.setState({tab: true})}>
                            <a>Global Settings</a>
                        </li>
                    </ul>
                </div>
                {
                    this.state.tab ? this.renderGlobalSettings() : this.renderInfoBoxes()
                }
            </div>
        )
    }
}

export default ConfigContainer