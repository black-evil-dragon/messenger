import React from 'react'
import { useContext } from 'react';


import { Routes, Route, useNavigate } from "react-router-dom";

import { reducer } from './reducer'
import socket from './socket/socket'
import api from './http/api';

import { Context } from '.';
import { Reducer } from './hooks/useDispatch'

import './assets/styles/css/index.css'


import SignIn from './components/loginForm/SignIn'
import SignUp from './components/loginForm/SignUp'

import UserProfile from './components/ProfileSections/UserProfile/UserProfile';
import ContactProfile from './components/ProfileSections/ContactProfile'

import Navigation from './components/ui/Navigation/Navigation';

import Auth from './components/userSections/Auth'
import Contacts from './components/userSections/Contacts';
import Notifications from './components/userSections/Notifications';
import Messenger from './components/userSections/Messenger'


function App() {
    const navigate = useNavigate()
    const [show, setShowing] = React.useState(false)
    const [state, dispatch] = React.useReducer(reducer, {
        isLogin: false,
        userID: null,
        userMail: null,
        userLogin: null,
        userName: null,
        userChats: [],
        userURL: '',
        userContacts: [],
    })
    const useDispatch = new Reducer(reducer, dispatch)
    const variablesContext = useContext(Context)


    const onLogin = async (user, isNav) => {
        socket.io.opts.query = {
            userLogin: user.userLogin,
            userToken: localStorage.getItem('token')
        }
        socket.connect()

        useDispatch.setState('LOGIN', user)

        isNav && navigate(user.url)
    }

    const checkData = async () => {
        const response = await api.post(`${variablesContext.API_URL}/api/update/data`)

        if (!response) {
            alert('Сервер недоступен');
            console.error('Сервер недоступен', response);
            return
        }

        if (response.data === '401C' || !response.data) {
            checkAuth()
        } else {
            socket.io.opts.query = {
                userLogin: response.data.userLogin
            }
            setData(response.data)
            onLogin(response.data, false)
        }
    }

    const checkAuth = async () => {
        if (localStorage.getItem('token')) {
            const response = await api.post(`${variablesContext.API_URL}/api/auth`)

            if (response !== '401CE' && response.data !== '401C' && response.data) {
                onLogin(response.data, false)
                setShowing(true)
            } else {
                setLogout()
            }

        } else {
            navigate('/auth')
        }
    }

    const setLogout = async () => {
        localStorage.removeItem('token')
        await api.post(`${variablesContext.API_URL}/api/logout`, { userLogin: state.userLogin })

        useDispatch.setState('LOGOUT', {})

        navigate('/auth')
        setShowing(true)
        socket.close()
    }

    const setData = async data => useDispatch.setState('SET_DATA', data)
    const addContact = async data => useDispatch.setState('ADD_CONTACT', data)

    React.useEffect(() => {
        checkData()

        socket.on('debug', response => console.log(response))
        socket.on('update:data', response => checkData())

        socket.on('server:error', response => console.warn(response))
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
            {state.isLogin && <Navigation url={state.userURL} showMenu={openMenu} />}
            {state.isLogin ?
                <Routes>
                    <Route path='/auth' element={
                        <Auth
                            {...state}
                            show={show}
                            checkData={checkData}
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

                            socket={socket}

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
                    <Route path={"/" + state.userURL}
                        element={<UserProfile
                            {...state}
                            navigate={navigate}
                            setLogout={setLogout}

                            openMenu={openMenu}
                        />}
                    />
                </Routes> :
                <>
                    <Routes>
                        <Route path='/' element={
                            <div className='app__loading'><div className="app__loading-spinner"></div></div>
                        } />

                        <Route path='/auth' element={
                            <Auth
                                {...state}
                                show={show}
                                checkData={checkData}
                            />
                        } />

                        <Route path="/signin"
                            element={<SignIn
                                onLogin={onLogin}
                            />}
                        />
                        <Route path="/signup"
                            element={<SignUp />}
                        />
                    </Routes>
                </>}
        </div>
    )
}

export default App