import React from 'react'

import api from '../../../../http/axios'


function ChatBox({ params }) {

    const chatName = params.ChatName
    return (
        <>
            <div className='chat' id='chat-box'>
                {chatName &&
                    <>
                        <div className='chat__title'>
                            <h3>{params.ChatName}</h3>
                        </div>
                        <div className="chat__messages">
                        </div>
                        <div className="chat__input">
                            <textarea></textarea>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default ChatBox