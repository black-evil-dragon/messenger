// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLogin: true,
                userName: action.payload.userName,
                userLogin: action.payload.userLogin,
                url: action.payload.url
            }
        case 'LOGOUT':
            return {
                ...state,
                isLogin: false,
                url: action.payload.url
            }
        case 'SET_CONTACTS':
            return {
                ...state,
                contacts: [...state.contacts, action.payload]
            }
        case 'SET_DATA':
            return {
                ...state,
                contacts: action.payload.contacts
            }
        default:
            return state;
    }
}
