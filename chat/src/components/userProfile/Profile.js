import React from 'react'

import axios from 'axios'
import api from '../../http/axios'


export default function Profile({ userLogin, userMail, userName, navigate, setLogout }) {

    return (
        <div className='profile-page'>
            <div className='profile-info'>
                <div className='profile-user'>
                    <h3>{userMail}</h3>
                    <p>{userLogin} <span>{userName}</span></p>
                </div>
                <button onClick={setLogout}>Выйти</button>
            </div>
        </div>
    )
}
