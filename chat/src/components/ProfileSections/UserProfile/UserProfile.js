import React from 'react'

import Header from '../../ui/Header/Header'

export default function UserProfile({ userLogin, userMail, userName, setLogout, openMenu }) {

    return (
        <div className='profile'>
            <Header openMenu={openMenu} />
            <div className='profile__content'>
                <div className='profile__user'>
                    <h3>{userMail}</h3>
                    <p>{userLogin} <span>{userName}</span></p>
                </div>

                <div className="profile__button">
                    <button className='danger' onClick={setLogout}>Выйти</button>
                </div>
            </div>
        </div>
    )
}
