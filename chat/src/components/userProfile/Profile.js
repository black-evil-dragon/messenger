import React from 'react'

export default function Profile({ userLogin, userMail, userName, navigate, setLogout }) {

    return (
        <div className='profile-page'>
            <div className='profile-info'>
                <div className='profile-user'>
                    <h3>{userMail}</h3>
                    <p>{userLogin} <span>{userName}</span></p>
                </div>
                <button className='danger' onClick={setLogout}>Выйти</button>
            </div>
        </div>
    )
}
