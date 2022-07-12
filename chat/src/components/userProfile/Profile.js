import React from 'react'

import axios from 'axios'
import api from '../../http/axios'


export default function Profile({userLogin, userMail, userName, navigate, setLogout}) {

    const logout = async () => {
        const response = await axios.post('/api/logout', { userLogin })
        setLogout()
    }
    const test = async () => {
        const response = await api.get('/users')
        if(response){
            console.log(response.data);
        }
    }

    return (
        <div>
            <div>Информация</div>
            <hr></hr>
            <div>{userMail}</div>
            <div>{userLogin}</div>
            <div>{userName}</div>
            <hr></hr>
            <button onClick={logout}>Выйти</button>
            <button onClick={test}>get users</button>
        </div>
    )
}
