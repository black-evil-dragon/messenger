/**
 * Класс для работы с Reducer
 * @param {} reducer Информация
 * @param {} type Тип dispatch
 */

export class Reducer {
    reducer
    dispatch

    constructor(reducer, dispatch) {
        this.reducer = reducer
        this.dispatch = dispatch
    }

    setState = async (type, payload) => {
        if(!type) return

        await this.dispatch({
            type: type,
            payload: payload
        })
    }

}