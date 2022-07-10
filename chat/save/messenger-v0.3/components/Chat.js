import React from 'react'
import socket from '../socket'


export default function Chat({ users, messages, userName, ID, onAddMessage }) {

    const [messageValue, setMessage] = React.useState('')
    //const messagesRef = React.useRef(null)

    const onSendMessage = () => {
        if (messageValue !== '') {
            socket.emit('CHAT:NEW_MESSAGE', {
                ID,
                userName,
                text: messageValue
            })
            setMessage('')
            onAddMessage({
                userName,
                text: messageValue
            })
        }
    }

    /*React.useEffect(() => {
        messagesRef.current.scrollTo(0, 99999);
      }, [messages])*/


    /* Enter text */
    try {
        const textarea = document.querySelector('#txt-area')
        textarea.onkeydown = function (e) {
            e = e || window.event;
            if (e.shiftKey && e.key === "Enter") {
                e.preventDefault()

                textarea.value =
                    textarea.value.substring(0, textarea.selectionStart) +
                    "\n" +
                    textarea.value.substring(textarea.selectionEnd, textarea.value.length);
            }
            if( e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage()
            }
        }

    } catch (error) {
        console.log(error);
    }

    const users_menu = document.querySelector('.chat-users')
    const showMenu = () => {
        if(users_menu.style.maxWidth){
            users_menu.style.maxWidth = null
        } else {
            users_menu.style.width = 100 + '%'
            users_menu.style.maxWidth = users_menu.scrollWidth + '%'
        }
    }
    return (
        <div className='chat-block'>
            <div className="chat-panel">
                <div className="header-menu">
                    <button onClick={showMenu}>Меню</button>
                    <h3>Мессенджер 0.1</h3>
                </div>
                <div className="chat-users">
                    <div className="chat-header">
                        <h2>Чат</h2>
                        <hr />
                        <h3>Online: {users.length}</h3>
                    </div>
                    <div className="users-online">
                        {users.map((name, index) => (
                            <p key={name + index}>{name}</p>
                        ))}
                    </div>
                    <div className="menu">
                        <button>
                            Выйти
                        </button>
                    </div>
                </div>
                <div className="chat">
                    <div className="chat-messages">
                        {messages.map(
                            (message, index) => (
                                <div className="message">
                                    <div className="user-message">
                                        <p>
                                            {message.text}
                                        </p>
                                    </div>
                                    <span>From: {message.userName}</span>
                                </div>
                            )
                        )}
                    </div>
                    <div className="chat-input">
                        <textarea id='txt-area' value={messageValue} rows="3" onChange={(e) => { setMessage(e.target.value) }}></textarea>
                        <button type='button' onClick={onSendMessage}><p>Send</p></button>
                    </div>
                </div>
            </div>
        </div>
    )
}
