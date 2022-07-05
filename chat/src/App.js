import React, { Component } from 'react'

import reducer from './reducer';
import socket from './socket';
import axios from 'axios';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { Routes, Route, useNavigate } from "react-router-dom";


//import './assets/styles/css/index.min.css'
//import './assets/styles/css/media.min.css'

import SignIn from './components/SignIn';
import SignUp from '././components/SignUp'
import Navigation from './components/Nav'
import JoinBlock from './components/JoinBlock';
import Chat from './components/Chat';
import Profile from './components/Profile'
import Contacts from './components/Contacts';



const cookie_key = 'sessionID';


export default function App() {
    let navigate = useNavigate()

    const [state, dispatch] = React.useReducer(reducer, {
        isLogin: false,
        userLogin: null,
        userName: null,
        chats: [],
        url: 'profile',
        contacts: []
    })

    const onLogin = async (object) => {
        const user_data = await axios.post('/user', object)

        object = {
            userLogin: user_data.data.userLogin,
            userName: user_data.data.userName,
            url: user_data.data.url,
            contacts: user_data.data.contacts
        }
        bake_cookie(cookie_key, object);
        dispatch({
            type: 'LOGIN',
            payload: object
        })
        setData(object)
        navigate(object.url)
    }
    const setData = (object) => {
        dispatch({
            type: 'SET_DATA',
            payload: object
        })
    }
    const deleteCookie = () => {
        delete_cookie(cookie_key)
        dispatch({
            type: 'lOGOUT',
            payload: 'profile'
        })
        navigate('/')
        window.location.reload();

    }

    React.useEffect(() => {
        if (read_cookie(cookie_key).length !== 0) {
            const object = {
                userLogin: read_cookie(cookie_key).userLogin,
                userName: read_cookie(cookie_key).userName,
                url: read_cookie(cookie_key).url
            }
            onLogin(object)
        }
    }, [])

    const giveContacts = async (object) => {
        const user_data = await axios.post('/user', object)
        const contacts = user_data.data.contacts

        contacts.forEach(element => {
            dispatch({
                type: 'SET_CONTACTS',
                payload: element
            })
        });
        setData({contacts: contacts})
    }


    return (
        <div>
            <Navigation url={state.url} isLogin={state.isLogin}/>
            <br></br>
            <Routes>
                <Route path="/" element={<div></div>} />
                <Route path="/signin" element={<SignIn onLogin={onLogin} navigate={navigate} />} />
                <Route path="/signup" element={<SignUp onLogin={onLogin} />} />
                <Route path={"/" + state.url} element={!state.isLogin ? <div>Not user</div> : <Profile {...state} deleteCookie={deleteCookie} />} />
                <Route path="contacts" element={<Contacts  giveContacts={giveContacts} userLogin={read_cookie(cookie_key).userLogin}/>} />
            </Routes>
        </div>
    );
}


/* draft


*/
