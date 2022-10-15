// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch (action.type) {
        //надо переписать
        case 'LOGIN':
            return {
                ...state,
                isLogin: true,
                userID: action.payload.userID,
                userMail: action.payload.userMail,
                userLogin: action.payload.userLogin,
                userName: action.payload.userName,
                chats: action.payload.chats,
                url: action.payload.url,
                contacts: action.payload.contacts,
                notice: action.payload.notice
            }
        case 'SET_DATA':
            return {
                ...state,
                userID: action.payload.userID,
                userMail: action.payload.userMail,
                userLogin: action.payload.userLogin,
                userName: action.payload.userName,
                chats: action.payload.chats,
                url: action.payload.url,
                contacts: action.payload.contacts,
                notice: action.payload.notice
            }
        case 'ADD_CONTACT':
            return {
                ...state,
                contacts: [...state.contacts, action.payload]
            }
        case 'CHANGE_URL':
            return {
                ...state,
                currentPage: action.payload
            }

        /* New code */

        case 'CHAT/SET_DATA':
            return {
                ...state,
                selectChat: true,
                chatName: action.payload.chatName,
                chatID: action.payload.ChatID,
                members: action.payload.members,
                settings: action.payload.settings,

                messages: action.payload.messages
            }
        case 'CHAT/HIDE':
            return {
                ...state,
                selectChat: action.payload,
            }
        case 'CHAT/ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        case 'CHAT/LAST_MESSAGE':
            return {
                ...state,
                lastMessage: action.payload
            }
        default:
            return state;
    }
}
