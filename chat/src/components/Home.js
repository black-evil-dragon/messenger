import React from 'react'

import { useNavigate } from "react-router-dom";


export default function Home({ isLogin }) {
    const navigate = useNavigate()

    const signinPage = () => navigate('/signin')
    const signupPage = () => navigate('/signup')

    return (
        <div>
            {!isLogin ?
                <div>
                    <button onClick={signinPage}>Войти</button>
                    <button onClick={signupPage}>Зарегестрироваться</button>
                </div>
                :
                <div></div>
            }
        </div>
    )
}
