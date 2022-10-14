import React from 'react'

import { useNavigate } from "react-router-dom";


export default function Home() {
    const navigate = useNavigate()

    return (
        <div className='auth'>
            <div className='auth__menu'>
                <h3 className='auth__title'>Добро пожаловать!</h3>
                <div className="auth__button">
                    <button className='button-dark' onClick={() => navigate('/signin')} id='signin'>Войти</button>
                </div>
                <div className="auth__button">
                    <button className='button-dark' onClick={() => navigate('/signup')} id='signup'>Зарегестрироваться</button>
                </div>
            </div>

            <div className="auth__version">
                <p>v. 0.0.3.11</p>
            </div>
        </div>
    )
}
