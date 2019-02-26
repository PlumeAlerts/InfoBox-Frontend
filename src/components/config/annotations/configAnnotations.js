import React from 'react'
import {connect} from 'react-redux'

import Annotation from "../../annotation/annotation"
import AddOrEditAnnotation from "./components/componentAddOrEditAnnotation"
import {addAnnotation, deleteAnnotation, setRender} from "../../../actions"
import Authentication from "../../../util/authentication"

class ConfigAnnotations extends React.Component {
    constructor(props) {
        super(props)
        this.twitch = window.Twitch ? window.Twitch.ext : null
        this.Authentication = new Authentication()
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                this.Authentication.setToken(auth.token, auth.userId)
                this.Authentication.makeCall(`${process.env.REACT_APP_API_ENDPOINT}/annotation/config`).then(value => {
                    value.json().then(content => {
                        for (let i = 0; i < content.length; i++) {
                            this.props.addAnnotation(content[i])
                            this.props.setRender(false)
                        }
                    })
                }).catch(reason => {

                })
            })
        }
    }

    onDeleteInfo(data) {
        this.Authentication.makeCall(`${process.env.REACT_APP_API_ENDPOINT}/annotation/config?id=${data.id}`, "DELETE", JSON.stringify(data))
            .then(value => {
                this.props.deleteAnnotation(data.id)
            })
    }

    render() {
        const that = this
        return (
            <div>
                {
                    this.props.render ? this.props.render : (
                        <div>
                            <nav className="level">
                                <div className="level-left">
                                    <div className="level-item">
                                        <h1 className="title is-4">List of annotations</h1>
                                    </div>
                                </div>
                                <div className="level-right">
                                    <p className="level-item">
                                        <a className="button is-link"
                                           onClick={(e) => that.props.setRender(<AddOrEditAnnotation/>)}>
                                            Add Annotation
                                        </a>
                                    </p>
                                </div>
                            </nav>
                            <hr/>
                            <div>
                                {
                                    this.props.annotationList.length > 0 ? (
                                        this.props.annotationList.map(function (annotation, index) {
                                            return (
                                                <div key={index} className="columns">
                                                    <div className="column is-one-third">
                                                        <Annotation annotation={annotation}/>
                                                    </div>
                                                    <div className="column is-one-third"/>
                                                    <div className="column is-one-third">
                                                        <a className="button is-info"
                                                           onClick={(e) => that.props.setRender(<AddOrEditAnnotation
                                                               annotation={annotation}/>)}>
                                                            Edit
                                                        </a>
                                                        <br/>
                                                        <br/>
                                                        <a className="button is-danger"
                                                           onClick={(e) => that.onDeleteInfo(annotation)}>
                                                            Delete
                                                        </a>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div>
                                            There is no annotations.
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        annotationList: state.annotationList,
        render: state.render,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addAnnotation: (content) => dispatch(addAnnotation(content)),
        setRender: (content) => dispatch(setRender(content)),
        deleteAnnotation: (content) => dispatch(deleteAnnotation(content))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigAnnotations)