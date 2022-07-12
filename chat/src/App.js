import React from 'react'

import axios from 'axios'
import reducer from './reducer/reducer'
import socket from './socket/socket'
import { Routes, Route, useNavigate } from "react-router-dom";
import api from './http/axios';


import Home from './components/Home'
import SignIn from './components/loginForm/SignIn'
import SignUp from './components/loginForm/SignUp'
import Navigation from './components/Navigation';
import Profile from './components/userProfile/Profile'

function App() {

    const [state, dispatch] = React.useReducer(reducer, {
        isLogin: false,
        userMail: null,
        userLogin: null,
        userName: null,
        chats: [],
        url: '',
        contacts: []
    })

    let navigate = useNavigate()

    React.useEffect(() => {
        if(state.url === '') {
            navigate('/')
        }
    }, [])

    const onLogin = async (user) => {
        await dispatch({ // await еще как влияет, спасибо vsc
            type: 'LOGIN',
            payload: user
        })
        navigate(user.url)
    }

    const setLogout = async () => {
        localStorage.removeItem('token')
        await dispatch({
            type: 'LOGOUT'
        })
        navigate('/')
    }

    return (
        <div>
            <br></br>
            <Routes>
                <Route path="/" element={<Home navigate={navigate} {...state}/>} />
                <Route path="/signin" element={<SignIn onLogin={onLogin}/>} />
                <Route path="/signup" element={<SignUp />} />
                <Route path={"/" + state.url} element={<Profile {...state} navigate={navigate} setLogout={setLogout}/>} />
            </Routes>
        </div>
    )
}

export default App