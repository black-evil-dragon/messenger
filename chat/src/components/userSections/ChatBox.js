import React from 'react'

import api from '../../http/axios'


function ChatBox({ params, checkAuth, data }) {

    const chatName = params.ChatName
    return (
        <>
            <div className='chat-box'>
                {chatName &&
                    <>
                        <div className='chat-title'>
                            <h3>{params.ChatName}</h3>
                        </div>
                        <div className="chat-messages">
                        </div>
                        <div className="chat-input">
                            <textarea></textarea>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default ChatBox