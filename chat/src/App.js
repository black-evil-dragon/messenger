import React from 'react';

import JoinBlock from './components/JoinBlock';
import Chat from './components/Chat';


import reducer from './reducer';
import socket from './socket';
import axios from 'axios';


function App() {

    const [state, dispatch] = React.useReducer(reducer, {
        isJoin: false,
        userName: null,
        ID: null,
        users: [],
        messages: [],
    })

    const onLogin = async (object) => {
        dispatch({
            type: 'JOINED',
            payload: object
        })
        socket.emit('CHAT:JOIN', object)

        const { data } = await axios.get(`/chat/${object.ID}`)
        setUsers(data.users)
    }

    const setUsers = (users) => {
        dispatch({
            type: 'SET_USERS',
            payload: users
        })
    }

    const addMessage = (message) => {
        dispatch({
            type: 'SET_MESSAGES',
            payload: message
        })
    }

    React.useEffect(() => {
        socket.on('CHAT:SET_USERS', setUsers)
        socket.on('CHAT:ADD_MESSAGES', addMessage)
    }, [])

    window.socket = socket

    return (
        <div className=''>
            {!state.isJoin ? <JoinBlock onLogin={onLogin} /> : <Chat {...state} onAddMessage={addMessage}/>}
        </div>
    );
}

export default App;
