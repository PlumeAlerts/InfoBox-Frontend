export const render = (state = false, action) => {
    switch (action.type) {
        case 'SET_RENDER':
            return action.render
        default:
            return state
    }
}
