import React from 'react'

function ChatBox({ params }) {
    return (
        <div className='chat-box'>
            {!params ?
                <div></div>
                :
                <div>{params.ChatName}</div>
            }
        </div>
    )
}

export default ChatBox