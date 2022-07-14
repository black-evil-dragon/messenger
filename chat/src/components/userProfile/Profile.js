import React from 'react'

import axios from 'axios'
import api from '../../http/axios'


export default function Profile({userLogin, userMail, userName, navigate, setLogout}) {

    return (
        <div>
            <div>Информация</div>
            <hr></hr>
            <div>{userMail}</div>
            <div>{userLogin}</div>
            <div>{userName}</div>
            <hr></hr>
            <button onClick={setLogout}>Выйти</button>
        </div>
    )
}
