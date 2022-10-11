export class Reducer {
    reducer
    dispatch

    constructor(reducer, dispatch) {
        this.reducer = reducer
        this.dispatch = dispatch
    }

    setState = async payload => {
        if(!payload.type && !payload.data) return

        await this.dispatch({
            type: payload.type,
            payload: payload.data
        })
    }

}