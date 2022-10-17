import React from 'react'

import api from '../../../../http/axios'
import socket from '../../../../socket/socket'


function ChatBox({ addMessage, setPreview, userID, userName, selectChat, chatName, members, messages, chatID }) {

    const [messageText, setMessage] = React.useState('')
    const [typingStatus, setTypingStatus] = React.useState('')

    const lastMessage = React.useRef(null)

    let timeout

    const sendMessage = () => {
        setMessage('')

        const messageData = {
            userID: userID,
            userName: userName,
            messageText,
            type: 'text'
        }

        socket.emit('chat:send-message', { chatID, messageData })
        addMessage(messageData)
    }


    const handleTyping = (event) => {
        if (event.key === 'Enter') {
            sendMessage()
        } else {
            socket.emit('chat:user-typing', userName)
            clearTimeout(timeout)

            timeout = setTimeout(() => {
                socket.emit('chat:user-typing', '')
            }, 500)
        }
    }

    React.useEffect(() => {
        lastMessage.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    React.useEffect(() => {
        socket.on('chat:user-typing/res', response => {
            setTypingStatus(response)
        })
    }, [socket])

    return (
        <>
            {selectChat &&
                <div className='chat' id='chat-box'>
                    <div className='chat__header'>
                        <div className="chat__header-icon"></div>
                        <div className='chat__header-info'>
                            <h3>{chatName}</h3>
                            <span>{typingStatus ? `${typingStatus} печатает...` : `Участников: ${members.length}`}</span>
                        </div>
                    </div>
                    <div className="chat__messages">
                        {messages.length ? messages.map((message, id) => (
                            <div ref={lastMessage} key={id} className={`chat__message-content ${userID === message.userID ? 'my' : ''}`}>
                                <div className={`chat__message-icon ${userID === message.userID ? 'my' : ''}`}></div>
                                <div className="chat__message">
                                    <div className="chat__message-text">
                                        <p>{message.messageText}</p>
                                    </div>
                                    <div className={`chat__message-sender ${userID === message.userID ? 'my' : ''}`}>
                                        <span>{message.userName}</span>
                                    </div>
                                </div>
                            </div>
                        )) : <></>}
                    </div>
                    <div className="chat__input">
                        <div className="chat__input-text">
                            <input type="text" placeholder='Нашите сообщение' onChange={e => setMessage(e.target.value)} onKeyDown={handleTyping} value={messageText} />
                        </div>
                        <div className="chat__input-sender">
                            <button onClick={() => sendMessage(messageText)}>Отправить</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ChatBox