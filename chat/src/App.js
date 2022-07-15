import React from 'react'

import axios from 'axios'
import reducer from './reducer/reducer'
import socket from './socket/socket'
import { Routes, Route, useNavigate } from "react-router-dom";
import api from './http/axios';


import './assets/styles/css/index.min.css'


import Home from './components/Home'
import SignIn from './components/loginForm/SignIn'
import SignUp from './components/loginForm/SignUp'
import Navigation from './components/Navigation';
import Profile from './components/userProfile/Profile'
import Notice from './components/Notice';
import Contacts from './components/Contacts';

function App() {
    const [show, setShowing] = React.useState(false)
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

    const onLogin = async (user, nav) => {
        await dispatch({ // await еще как влияет, спасибо vsc
            type: 'LOGIN',
            payload: user
        })
        nav && navigate(user.url)
    }

    const setLogout = async () => {
        localStorage.removeItem('token')
        await axios.post('/api/logout', state.userLogin)
        await dispatch({
            type: 'LOGOUT'
        })
        navigate('/')
    }


    const checkAuth = async (token) => {
        setShowing(false)
        const response = await api.post('/api/refresh')

        if (response.data !== '401C') {
            const response = await api.post('/api/auth')
            onLogin(response.data, false)
            setShowing(true)
        } else {
            const userLogin = state.userLogin
            await axios.post('/api/logout', { userLogin })
            setLogout()
            setShowing(true)
        }
    }


    React.useEffect(() => {
        localStorage.getItem('token') ? checkAuth(localStorage.getItem('token')) : setShowing(true)
        if (state.url === '') navigate('/')
    }, [])


    return (
        <div className='app-page'>
            {state.isLogin && <Navigation url={state.url}/>}
            <Routes>
                <Route path="/" element={
                    <Home navigate={navigate} {...state} show={show} />
                } />
                <Route path='/notice' element={<Notice />}/>
                <Route path='/contacts' element={<Contacts />}/>
                <Route path="/signin" element={<SignIn onLogin={onLogin} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path={"/" + state.url} element={<Profile {...state} navigate={navigate} setLogout={setLogout} />} />
            </Routes>
        </div>
    )
}

export default App