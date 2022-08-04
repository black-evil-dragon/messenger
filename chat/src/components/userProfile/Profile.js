import React from 'react'

import Header from '../ui/Header'

export default function Profile({ userLogin, userMail, userName, setLogout, openMenu }) {

    return (
        <div className='profile-page'>
            <Header openMenu={openMenu} />
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
