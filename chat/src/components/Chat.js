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
    return (
        <div className='chat-block'>
            <div className="chat-panel">
                <div className="chat-users">
                    <p>Online: {users.length}</p>
                    <div className="users-online">
                        {users.map((name, index) => (
                            <p key={name + index}>{name}</p>
                        ))}
                    </div>
                </div>
                <div className="chat">
                    <div className="chat-messages">
                        {messages.map(
                            (message, index) => (
                                <div className="message">
                                    <div className="user-message">
                                        <p>{message.text}</p>
                                    </div>
                                    <span>{message.userName}</span>
                                </div>
                            )
                        )}
                    </div>
                    <div className="chat-input">
                        <textarea value={messageValue} rows="3" onChange={(e) => { setMessage(e.target.value) }}></textarea>
                        <button type='button' onClick={onSendMessage}><p>Send</p></button>
                    </div>
                </div>
            </div>
        </div>
    )
}
