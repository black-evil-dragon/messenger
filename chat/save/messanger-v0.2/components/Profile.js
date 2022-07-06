import React from 'react'

import axios from 'axios'
import { Routes, Route } from 'react-router'
import { Link } from 'react-router-dom'

import Contacts from './Contacts'


export default function Profile({ userLogin, userName, deleteCookie, contacts, giveContacts }) {

    const deleteContact = async (e) => {
        const contactLogin = e.target.parentElement.firstChild.innerText // Мне кажется очень криво
        const object = {
            userLogin: userLogin,
            contactLogin: contactLogin
        }

        const result = await axios.post('/removecontact', object)
        if(!result.data){
            console.log(result.data);
        }
        giveContacts(object)
    }

    return (
        <div>
            <div>
                Profile
                user: {userLogin}, {userName}
            </div>
            <br></br>
            <button onClick={deleteCookie}>Logout</button>
            <br></br>
            <br></br>
            <div>
                Contacts
                <div>
                    {contacts.map(function (d, idx) {
                        return (
                            <div key={idx}>
                                <li>{d.userLogin}</li>
                                <button onClick={deleteContact}>Удалить</button>
                            </div>
                        )
                    })}
                </div>
            </div>
            <br></br>
            <br></br>
        </div>
    )
}

/*
const addContact = async () => {
        const object = {
            contactLogin: contactLogin,
            userLogin: userLogin
        }
        const result = await axios.post('/getcontact', object)
        if (!result.data) {
            giveContacts(object)
            setNotice('Success!')

        } else {
            setNotice(result.data)
        }
        setContact('')

*/