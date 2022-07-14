import React from 'react'

import { useNavigate, Link } from "react-router-dom";


export default function Home({ isLogin, url, userLogin, show }) {
    const navigate = useNavigate()

    const signinPage = () => navigate('/signin')
    const signupPage = () => navigate('/signup')


    const loginForm = <div>
        <button onClick={signinPage}>Войти</button>
        <button onClick={signupPage}>Зарегестрироваться</button>
    </div>
    const mainPage = <div>
        <div>Главная страница</div>
        <Link to={`${url}`}>{userLogin}</Link>
    </div>
    const loadingPage = <div>
        Загрузка
    </div>
    return (
        <div>
            {show ?
                !isLogin ? loginForm : mainPage
            : loadingPage
            }
        </div>
    )
}
