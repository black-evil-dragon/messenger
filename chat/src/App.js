import React from 'react'

import axios from 'axios'
import { Routes, Route, useNavigate } from "react-router-dom";

import reducer from './reducer/reducer'
import socket from './socket/socket'
import api from './http/axios';


import './assets/styles/css/index.min.css'


import SignIn from './components/loginForm/SignIn'
import SignUp from './components/loginForm/SignUp'

import Profile from './components/userProfile/Profile'

import Header from './components/ui/Header';
import Navigation from './components/ui/Navigation';

import Home from './components/userSections/Home'
import Contacts from './components/userSections/Contacts';
import Notice from './components/userSections/Notice';
import Messenger from './components/userSections/Messenger'
import ProfileContact from './components/userSections/ProfileContact';



function App() {
    const navigate = useNavigate()
    const [show, setShowing] = React.useState(false)
    const [state, dispatch] = React.useReducer(reducer, {
        isLogin: false,
        userMail: null,
        userLogin: null,
        userName: null,
        notice: {
            invites: [],
            other: []
        },
        chats: [],
        url: '',
        contacts: [],

        currentPage: '/'
    })

    const onLogin = async (user, isNav) => {
        const socketID = await socket.id

        socket.emit('user:login', {
            userLogin: user.userLogin,
            userName: user.userName,
            socketID: socketID
        })
        await dispatch({ // await еще как влияет, спасибо vsc
            type: 'LOGIN',
            payload: user
        })
        isNav && navigate(user.url)
    }

    const setLogout = async () => {
        localStorage.removeItem('token')
        await axios.post('/api/logout', state.userLogin)
        await dispatch({
            type: 'LOGOUT'
        })
        navigate('/auth')
        setShowing(true)
        document.location.reload()
    }


    const checkAuth = async () => {
        const response = await api.post('/api/auth')

        if (response !== '401C') {
            onLogin(response.data, false)
            setShowing(true)
        } else {
            const userLogin = state.userLogin
            await axios.post('/api/logout', { userLogin })
            setLogout()
        }

    }

    const setData = async (data) => {
        await dispatch({
            type: 'SET_DATA',
            payload: data
        })
    }

    const addContact = async (data) => {
        await dispatch({
            type: 'ADD_CONTACT',
            payload: data
        })
    }

    const checkData = async () => {
        const response = await api.post('/api/update/data')
        if (response.data === '401C') {
            checkAuth()
        } else {
            setData(response.data)
        }
    }

    React.useEffect(() => {
        localStorage.getItem('token') ?
            checkAuth()
            :
            setShowing(true)
            navigate('/auth')

        socket.on('chat:created', (response) => {
            console.log(`${response.socketID} conntected to this chat`);
        })

        socket.on('response:error', (response) => {
            console.log(response)
        })

    }, [])

    window.socket = socket

    const openMenu = () => {
        const panel = document.querySelector('.navigation-bar')
        panel.classList.toggle('open')

        if (panel.style.maxWidth) {
            panel.style.maxWidth = null
        } else {
            panel.style.width = '100%'
            panel.style.maxWidth = `${panel.scrollWidth}px`
        }
    }



    return (
        <div className='app-page'>
            {state.isLogin && <Navigation url={state.url} showMenu={openMenu} />}
            <Routes>
                <Route path='/auth' element={
                    <Home
                        {...state}
                        show={show}
                    />
                } />
                <Route path="/chat_:ChatName/id:id"
                    element={<Messenger
                        {...state}
                        checkAuth={checkAuth}
                        checkData={checkData}

                        openMenu={openMenu}
                    />}
                />
                <Route path="/" element={
                    <Messenger
                        {...state}
                        checkAuth={checkAuth}
                        checkData={checkData}

                        openMenu={openMenu}
                    />
                } />
                <Route path='/notice'
                    element={<Notice
                        {...state}
                        setData={setData}
                        checkAuth={checkAuth}
                        addContact={addContact}
                        checkData={checkData}

                        openMenu={openMenu}
                    />}
                />
                <Route path='/contacts'
                    element={<Contacts
                        {...state}
                        checkAuth={checkAuth}
                        checkData={checkData}

                        openMenu={openMenu}
                    />}
                />
                <Route path="/signin"
                    element={<SignIn
                        onLogin={onLogin}
                    />}
                />
                <Route path="/signup"
                    element={<SignUp />}
                />

                <Route path={'/user/:login'}
                    element={<ProfileContact
                        userLogin={state.userLogin}
                        checkData={checkData}
                        checkAuth={checkAuth}
                        contacts={state.contacts}

                        openMenu={openMenu}
                    />}
                />
                <Route path={"/" + state.url}
                    element={<Profile
                        {...state}
                        navigate={navigate}
                        setLogout={setLogout}

                        openMenu={openMenu}
                    />}
                />
            </Routes>
        </div>
    )
}

export default App

/*



*/