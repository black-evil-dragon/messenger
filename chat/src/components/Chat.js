import React from 'react'
import socket from '../socket'

export default function Chat({ users, messages, userName, ID, onAddMessage }) {

    const [messageValue, setMessage] = React.useState('')
    //const messagesRef = React.useRef(null)

    const onSendMessage = () => {
        socket.emit('CHAT:NEW_MESSAGE', {
            ID,
            userName,
            text: messageValue
        })
        setMessage('')
        onAddMessage({
            userName, text: messageValue
        })
    }

    /*React.useEffect(() => {
        messagesRef.current.scrollTo(0, 99999);
      }, [messages])*/
    return (
        <div>
            <p>Онлайн: {users.length}</p>
            <ul>
                {users.map((name, index) =>
                (
                    <li key={name + index}>{name}</li>
                )
                )}
            </ul>

            {messages.map(
                (message, index) => (
                    <div key={index}>
                        <p><span>{message.userName} - </span>{message.text}</p>
                    </div>
                )
            )}

            <textarea value={messageValue} name="" id="" cols="30" rows="10" onChange={(e) => { setMessage(e.target.value) }}></textarea>
            <button type='button' onClick={onSendMessage}>Отправить</button>
        </div>
    )
}
