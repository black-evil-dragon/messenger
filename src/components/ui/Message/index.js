import React from 'react'

export default function Message({ message, id, userID }) {

    const my = userID === message.userID ? '_my' : ''
    //<div className={`message__icon ${my}`}></div>
    return (
        <div className={`message ${my}`}>
            <div className={`message__content ${my}`}>
                <div className={`message__text ${my}`}>
                    <p>{message.messageText}</p>
                </div>
                <div className={`message__sender ${my}`}>
                    <span>{message.userName}</span>
                </div>
            </div>
        </div>
    )
}

/*

*/