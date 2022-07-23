import React from 'react'

import { useNavigate, Link } from "react-router-dom";


export default function Home({ isLogin, url, userLogin, show }) {
    const navigate = useNavigate()

    const signinPage = () => navigate('/signin')
    const signupPage = () => navigate('/signup')


    const loginButtons = <div className='login-btn'>
        <h3>Добро пожаловать!</h3>
        <button onClick={signinPage} id='signin'>Войти</button><br></br>
        <button onClick={signupPage} id='signup'>Зарегестрироваться</button>
    </div>


    const mainPage = <div className='home-page'>
        <h3>Главная</h3>
    </div>


    const loadingPage = <div>
        Загрузка
    </div>


    return (
        <div className={'main-page ' + isLogin}>
            {show ?
                !isLogin ? loginButtons : mainPage
            : loadingPage
            }
        </div>
    )
}
