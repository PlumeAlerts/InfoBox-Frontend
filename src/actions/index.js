export const addAnnotation = annotation => ({
    type: 'ADD_ANNOTATION',
    annotation
})

export const editAnnotation = annotation => ({
    type: 'EDIT_ANNOTATION',
    annotation
})

export const deleteAnnotation = id => ({
    type: 'DELETE_ANNOTATION',
    id
})

export const setRender = render => ({
    type: 'SET_RENDER',
    render
})