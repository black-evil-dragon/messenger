// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        case 'JOINED':
            return {
                ...state,
                isJoin: true,
                userName: action.payload.userName,
                ID: action.payload.ID,
            }
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload,
            }
        case 'SET_DATA':
            return {
                ...state,
                users: action.payload.users,
                messages: action.payload.messages
            }
        case 'SET_MESSAGES':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        default:
            return state;
    }
}
