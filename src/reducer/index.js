export const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLogin: true,
                userID: action.payload.userID,
                userMail: action.payload.userMail,
                userLogin: action.payload.userLogin,
                userName: action.payload.userName,
                userChats: action.payload.userChats,
                userURL: action.payload.userURL,
                userContacts: action.payload.userContacts,
            }
        case 'SET_DATA':
            return {
                ...state,
                userID: action.payload.userID,
                userMail: action.payload.userMail,
                userLogin: action.payload.userLogin,
                userName: action.payload.userName,
                userChats: action.payload.userChats,
                userURL: action.payload.userURL,
                userContacts: action.payload.userContacts,
            }
        case 'ADD_CONTACT':
            return {
                ...state,
                userContacts: [...state.userContacts, action.payload]
            }


        case 'LOGOUT':
            return {
                ...state,
                isLogin: false,
                userID: null,
                userMail: null,
                userLogin: null,
                userName: null,
                userChats: [],
                userURL: null,
                userContacts: [],
            }

        /* New code */

        case 'CHAT/SET_DATA':
            return {
                ...state,
                selectChat: true,
                chatName: action.payload.chatName,
                chatID: action.payload.ChatID,
                chatMembers: action.payload.members,
                chatSettings: action.payload.settings,

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
