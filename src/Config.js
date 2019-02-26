import React from "react"
import ReactDOM from "react-dom"
import ConfigPage from "./components/config/configStreamAnnotations"
import {createStore} from 'redux'
import rootReducer from './reducers'
import { Provider } from 'react-redux'
const store = createStore(rootReducer)

import './assets/darkly.scss'

ReactDOM.render(
    <Provider store={store}>
        <ConfigPage/>
    </Provider>,
    document.getElementById("root")
)