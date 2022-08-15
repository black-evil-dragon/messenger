import React from 'react'

import { useNavigate } from "react-router-dom";


export default function Home({ isLogin, url, userLogin, show }) {
    const navigate = useNavigate()

    return (
        <div className='auth'>
            <div className='auth__menu'>
                <h3 className='auth__title'>Добро пожаловать!</h3>
                <button className='auth__button' onClick={() => navigate('/signin')} id='signin'>Войти</button><br></br>
                <button className='auth__button' onClick={() => navigate('/signup')} id='signup'>Зарегестрироваться</button>
            </div>
        </div>
    )
}
