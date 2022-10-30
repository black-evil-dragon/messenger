import React from 'react'

import socket from '../../../socket/socket'
import { reducer } from '../../../reducer'

import ChatBox from './ChatBox'
import Header from '../../ui/Header'

import { Reducer } from '../../../hooks/useDispatch'

function Messenger({ chats, userLogin, isLogin, openMenu, checkData, userName, userID }) {
    const [selectedElement, selectThisElement] = React.useState()

    const [state, dispatch] = React.useReducer(reducer, {
        lastMessage: '',
        selectChat: false,

        userID: userID,
        userName: userName,

        chatName: null,
        chatID: null,
        chatMembers: [],
        chatSettings: null,

        messages: []
    })
    const useDispatch = new Reducer(reducer, dispatch)

    const selectChat = (chat, id) => {//надо переписать
        const messengerMenu = document.querySelector('.messenger__content')
        const chatElements = document.querySelectorAll('.messenger__chat')

        chatElements.forEach(element => {
            if (element.getAttribute('chat-id') === `${id}`) {
                element.classList.toggle('selected')

                selectedElement !== element ? selectThisElement(element) : selectThisElement(undefined)

            } else {
                element.classList.remove('selected')
            }
        });

        messengerMenu.classList.add('hidden')

        socket.emit('chat:enter', {
            chat,
            token: localStorage.getItem('token')
        })
    }

    const setChatData = async data => useDispatch.setState('CHAT/SET_DATA', data)
    const addMessage = async data => useDispatch.setState('CHAT/ADD_MESSAGE', data)
    const setPreview = async data => useDispatch.setState('CHAT/LAST_MESSAGE', data)


    React.useEffect(() => {
        socket.on('chat:sendData', response => {
            if (response === 401) {
                console.warn('Error with access token')
                checkData()
            } else {
                setChatData(response)
            }
        })

        socket.on('chat:add-message', response => {
            addMessage(response.messageData)
        })
    }, [])

    return (
        <>
            {isLogin &&
                <div className="messenger">
                    <div className="messenger__content">
                        <Header openMenu={openMenu} />

                        <div className="messenger__chats">
                            {chats && chats.length ?
                                chats.map(function (chat, id) {
                                    return (
                                        <div className='messenger__chat' chat-id={id} key={id} onClick={() => { selectChat(chat, id) /* Святой код, не трогай */ }}>
                                            <div className="messenger__chat-icon"></div>
                                            <div className="messenger__chat-preview">
                                                <p className='messenger__chat-name'>{chat.chatName}</p>
                                                <p className='messenger__chat-message'>{state.lastMessage}</p>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <p className='messenger__empty-text lone-wolf'><span>Упс, у вас нет чатов</span></p>
                            }
                        </div>
                    </div>
                    <ChatBox {...state} addMessage={addMessage} setPreview={setPreview} />
                </div>
            }
        </>
    )
}


export default Messenger

/*
<input type="radio" onClick={setPrivate} />
<span title='Создать беседу'>Беседа</span>

<div className='messenger__add-chat'>
                            <input className={notice.type} placeholder='Логин друга' type="text" value={contactLogin} onChange={(e) => { setLogin(e.target.value) }} />
                            <button className='messenger__button' onClick={createChat}>+</button> <br></br>
                        </div>

                        <div className="messenger__notice">
                            <p className={notice.type}>{notice.text}</p>
                        </div>
*/