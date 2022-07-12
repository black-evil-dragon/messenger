// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLogin: true,
                userMail: action.payload.userMail,
                userLogin: action.payload.userLogin,
                userName: action.payload.userName,
                //chats: action.payload.userChatts,
                url: action.payload.url,
                contacts: action.payload.contacts
            }
        case 'LOGOUT':
            return {
                ...state,
                isLogin: false,
                url: ''
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
