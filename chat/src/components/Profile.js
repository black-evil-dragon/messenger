import React from 'react'

import axios from 'axios'
import { Routes, Route } from 'react-router'
import { Link } from 'react-router-dom'

import Contacts from './Contacts'


export default function Profile({ userLogin, userName, deleteCookie, giveContacts, contacts }) {


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
                        return (<li key={idx}>{d.userLogin}</li>)
                    })}
                </div>
            </div>
            <br></br>
            <br></br>
        </div>
    )
}

/*
{data.map(function(d, idx){
    return (li key idx {d.userLogin})
})}

*/