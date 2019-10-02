export const annotationList = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ANNOTATION': {
            return [
                ...state,
                action.annotation
            ]
        }
        case 'EDIT_ANNOTATION': {
            let objIndex = state.findIndex((obj => obj.id === action.annotation.id))
            state[objIndex] = action.annotation
            return state
        }
        case 'DELETE_ANNOTATION': {
            return state.filter((obj => obj.id !== action.id))
        }
        default:
            return state
    }
}