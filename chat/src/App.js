import React, { Component } from 'react'

import reducer from './reducer';
import socket from './socket';
import axios from 'axios';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { Routes, Route, useNavigate } from "react-router-dom";


import './assets/styles/css/index.min.css'
import './assets/styles/css/media.min.css'

import Login from './components/Login';
import SignUp from '././components/SignUp'
import Navigation from './components/Nav'
import JoinBlock from './components/JoinBlock';
import Chat from './components/Chat';
import Profile from './components/Profile'



const cookie_key = 'userAuth';
console.log(read_cookie(cookie_key));


export default function App() {
    let navigate = useNavigate()

    const [state, dispatch] = React.useReducer(reducer, {
        isLogin: false,
        userLogin: null,
        userName: null,
        chats: [],
    })

    const onLogin = async (object) => {
        bake_cookie(cookie_key, object);

        dispatch({
            type: 'LOGIN',
            payload: object
        })
    }

    const deleteCookie = () => {
        delete_cookie(cookie_key)
        navigate('/')
    }

    React.useEffect(() => {
        if (read_cookie(cookie_key).length !== 0) {
            const object = {
                userLogin: read_cookie(cookie_key).userLogin,
                userName: read_cookie(cookie_key).userName
            }
            dispatch({
                type: 'LOGIN',
                payload: object
            })
            navigator()
        }
    }, [])
    return (
        <div>
            {!state.isLogin ?
                <div>
                    <Navigation />
                    <br></br>
                    <Routes>
                        <Route path="/" element={<div></div>} />
                        <Route path="/login" element={<Login onLogin={onLogin} />} />
                        <Route path="/signup" element={<SignUp onLogin={onLogin} />} />
                        <Route path="/profile" element={!state.isLogin ? <div>Not user</div> : <Profile {...state} deleteCookie={deleteCookie} />}/>
                    </Routes>
                </div>
                :
                <div>
                    <Profile {...state} deleteCookie={deleteCookie} />
                </div>
            }
        </div>
    );
}


/* draft

<Route path="/" element={<Navigation />} />

onSignUp={onSignUp}

const onSignUp = async (object) => {
        dispatch({
            type: 'SIGNUP',
            payload: object
        })
        socket.emit('USER:SIGNUP', object)
    }


*/
