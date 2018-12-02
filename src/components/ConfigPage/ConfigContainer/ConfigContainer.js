import React from 'react'
import ConfigInfo from './ConfigCommand/ConfigInfo'

import './ConfigContainer.css'

export default class ConfigContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            infos: this.props.infos
        }
    }

    onSubmit(event) {
        event.preventDefault();

        if (this.state.infos.length <= 5) {
            this.setState(prevState => {
                let infos = prevState.infos;
                infos.push({
                    title: this.state.title,
                    description: this.state.description,
                    date: new Date()
                });
                return {
                    infos
                }
            });
            this.titleInput.value = "";
            this.descriptionInput.value = ""
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    deleteInfo(key) {
        this.setState(prevState => {
                return {
                    infos: prevState.infos.filter(old => old.date != key)
                }
            }
        )
    }

    render() {
        return (
            <div className="config-container-container">
                <div className="config-container-form">
                    <form onSubmit={(e) => this.onSubmit(e)}>
                        <label>
                            Title:
                            <input
                                name="title"
                                type="text"
                                placeholder="Title"
                                onChange={(e) => this.handleInputChange(e)}
                                ref={el => this.titleInput = el}
                            />
                        </label>
                        <br/>
                        <label>
                            Description:
                            <input
                                name="description"
                                type="text"
                                placeholder="Description"
                                onChange={(e) => this.handleInputChange(e)}
                                ref={el => this.descriptionInput = el}
                            />
                        </label>
                        <br/>
                        <input type="submit" disabled={!this.state.title || !this.state.description} value="Add"/>
                    </form>
                    <hr/>
                </div>
                <div className="config-container-infos">
                    {this.state.infos.map((v, i) => {
                        return <ConfigInfo info={v} key={i} infoKey={v.date}
                                           delete={(key) => this.deleteInfo(key)}/>
                    })}
                </div>
                <div className="config-container-footer">
                    <input
                        type="button"
                        onClick={() => this.props.saveConfig(this.state.infos)}
                        disabled={this.state.infos.length === 0}
                        value="Save info!"
                    />
                </div>
            </div>
        )
    }
}