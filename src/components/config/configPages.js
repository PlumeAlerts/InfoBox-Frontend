import React from 'react'

import '../../assets/darkly.scss'
import ConfigAddEdit from "./container/configAddEdit";
import InfoBox from "../infobox/infobox";
import Authentication from "../../util/authentication";


class ConfigPages extends React.Component {
    constructor(props) {
        super(props);

        this.Authentication = new Authentication();
        this.twitch = window.Twitch ? window.Twitch.ext : null;

        this.state = {
            infoBoxes: [],
            tab: false,

            dirty: false,
            editInfo: false,
        };
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                this.Authentication.setToken(auth.token, auth.userId);
                this.Authentication.makeCall(`${process.env.REACT_APP_API_ENDPOINT}/config`).then(value => {
                    value.json().then(content => {
                        for (let i = 0; i < content.length; i++) {
                            this.onAddInfo(content[i]);
                        }
                    })
                }).catch(reason => {

                })
            });
        }
    }

    onAddInfo(data) {
        this.setState({editInfo: false});

        this.setState(prevState => {
            let infoBoxes = prevState.infoBoxes;
            infoBoxes.push(data);
            return {
                infoBoxes
            }
        });
    }


    onEditInfo(data) {
        this.setState({editInfo: false});

        this.setState(prevState => {
            let infoBoxes = prevState.infoBoxes;
            let objIndex = infoBoxes.findIndex((obj => obj.id === data.id));
            infoBoxes[objIndex] = data;
            return {
                infoBoxes
            }
        });
    }

    onDeleteInfo(data) {
        this.Authentication.makeCall(`${process.env.REACT_APP_API_ENDPOINT}/config?id=${data.id}`, "DELETE", JSON.stringify(data))
            .then(value => {
                this.setState(prevState => {
                    let infoBoxes = prevState.infoBoxes;
                    infoBoxes = infoBoxes.filter((obj => obj.id !== data.id));
                    return {
                        infoBoxes
                    }
                });
            });
    }

    render() {
        const that = this;
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
                                !this.state.editInfo ?
                                    <a className="button is-link"
                                       onClick={(e) => this.setState({
                                           editInfo: (
                                               <ConfigAddEdit onAddInfo={(e) => this.onAddInfo(e)}/>)
                                       })}>
                                        Add
                                    </a>
                                    : null
                            }
                        </p>
                    </div>
                </nav>
                <hr/>
                {
                    this.state.editInfo ? this.state.editInfo : (
                        <div>
                            {this.state.infoBoxes.map(function (info, index) {
                                return (
                                    <div key={index} className="columns">
                                        <div className="column is-one-third">
                                            <InfoBox info={info}/>
                                        </div>
                                        <div className="column is-one-third"/>
                                        <div className="column is-one-third">
                                            <a className="button is-link"
                                               onClick={(e) => that.setState({
                                                   editInfo: (
                                                       <ConfigAddEdit info={info}
                                                                      onEditInfo={(e) => that.onEditInfo(e)}/>)
                                               })}>
                                                Edit
                                            </a>
                                            <br/>
                                            <br/>
                                            <a className="button is-link"
                                               onClick={(e) => that.onDeleteInfo(info)}>
                                                Delete
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                }
            </div>
        )
    }
}

export default ConfigPages