import React from 'react'

import axios from 'axios'
import { Routes, Route, useNavigate } from "react-router-dom";

import reducer from './reducer/reducer'
import socket from './socket/socket'
import api from './http/axios';


import './assets/styles/css/index.css'


import SignIn from './components/loginForm/SignIn/SignIn'
import SignUp from './components/loginForm/SignUp/SignUp'

import UserProfile from './components/ProfileSections/UserProfile/UserProfile';
import ContactProfile from './components/ProfileSections/ContactProfile/ContactProfile'

import Navigation from './components/ui/Navigation/Navigation';

import Auth from './components/userSections/Auth/Auth'
import Contacts from './components/userSections/Contacts/Contacts';
import Notifications from './components/userSections/Notifications/Notifications';
import Messenger from './components/userSections/Messenger/Messenger'



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
    }


    const checkAuth = async () => {
        if (localStorage.getItem('token')) {
            const response = await api.post('/api/auth')

            if (response !== '401CE') {
                onLogin(response.data, false)
                setShowing(true)
            } else {
                setLogout()
            }

        } else {
            navigate('/auth')
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
            onLogin(response.data, false)
            setTimeout(() => {
                socket.emit('user:online', {
                    userInfo: response.data.userLogin,
                    socketID: socket.id
                })
            }, 1000)
        }
    }

    React.useEffect(() => {
        checkData()

        socket.on('response:error', (response) => {
            console.log(response)
        })

    }, [])

    window.socket = socket

    const openMenu = () => {
        const panel = document.querySelector('.navigation')
        const panelBackground = document.querySelector('.blur-dark')
        const transitionElement = document.querySelector('.app__transition')

        panel.classList.toggle('open')

        panelBackground.classList.toggle('show')
        transitionElement.classList.toggle('show')


        if (panel.style.maxWidth) {
            panel.style.maxWidth = null
        } else {
            panel.style.width = '100%'
            panel.style.maxWidth = `${panel.scrollWidth}px`
        }
    }



    return (
        <div className='app'>
            <div className="app__transition">
                <div className="blur-dark"></div>
            </div>
            {state.isLogin && <Navigation url={state.url} showMenu={openMenu} />}
            <Routes>
                <Route path='/auth' element={
                    <Auth
                        {...state}
                        show={show}
                    />
                } />

                <Route path="/" element={
                    <Messenger
                        {...state}
                        checkData={checkData}

                        openMenu={openMenu}
                    />
                } />
                <Route path='/notice'
                    element={<Notifications
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
                    element={<ContactProfile
                        userLogin={state.userLogin}
                        checkData={checkData}
                        checkAuth={checkAuth}
                        contacts={state.contacts}

                        openMenu={openMenu}
                    />}
                />
                <Route path={"/" + state.url}
                    element={<UserProfile
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