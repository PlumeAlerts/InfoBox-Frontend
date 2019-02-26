import {combineReducers} from 'redux'
import {annotationList} from './annotations'
import {render} from './render'

export default combineReducers({
    render, annotationList,
})