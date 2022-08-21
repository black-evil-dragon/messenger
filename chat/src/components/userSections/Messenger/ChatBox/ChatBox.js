import React from 'react'

import api from '../../../../http/axios'


function ChatBox({ selectChat, settings, members, chatName }) {

    return (
        <>
            {selectChat &&
                <div className='chat' id='chat-box'>
                    <div className='chat__header'>
                        <div className="chat__header-icon"></div>
                        <div className='chat__header-info'>
                            <h3>{chatName}</h3>
                            <span>Участников: {members.length}</span>
                        </div>
                    </div>
                    <div className="chat__messages">
                    </div>
                    <div className="chat__input">
                        <input type="text" placeholder='Нашите сообщение' />
                    </div>
                </div>
            }
        </>
    )
}

export default ChatBox