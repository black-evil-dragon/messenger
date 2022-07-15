import React from 'react'


import axios from 'axios'
import { Link } from 'react-router-dom'

import checkEmail from '../config/checkEmail'

export default function SignUp() {
    const [userMail, setMail] = React.useState('')
    const [userLogin, setLogin] = React.useState('')
    const [userName, setName] = React.useState('')
    const [userPassword, setPassword] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)
    const [isRegister, setRegister] = React.useState(false)
    const [notice, setNotice] = React.useState({})

    const onRegister = () => {
        if (!userMail) {
            setNotice({ text: 'Упс, похоже вы не ввели свою почту!', mail: 'error-mail' })
        } else if (!userLogin) {
            setNotice({ text: 'Упс, похоже вы не ввели свой логин!', login: 'error-mail' })
        } else if (!userName) {
            setNotice({ text: 'Упс, похоже мы не знаем, как вас зовут!', name: 'error-name' })
        } else if (!userPassword) {
            setNotice({ text: 'Упс, похоже вы не ввели свой пароль!', password: 'error-password' })
        } else {
            if (checkEmail(userMail)) {
                const user = {
                    userMail: userMail,
                    userLogin: userLogin,
                    userName: userName,
                    userPassword: userPassword
                }
                setNotice({})
                setLoading(true)
                registerUser(user)
            } else {
                setLoading(false)
                setNotice({ text: 'Упс, вы похоже неправильно ввели свою почту!', mail: 'error-mail' })
            }

        }
    }

    const registerUser = async (user) => {
        const response = await axios.post('/api/signup', user)
        if (!response.data) {
            setLoading(false)
            setNotice({ text: 'Упс, такой пользователь уже существует)' })
        } else {
            setRegister(true)
            setLoading(true)
        }
    }

    return (
        <div className='main-page'>
            <div className="register-page">
                {!isRegister
                    ?
                    <div className='register-form'>
                        <h3>Регистрация</h3>
                        <div className='register-input'>
                            <input className={notice.mail} placeholder='E-mail' type="text" value={userMail} onChange={(e) => { setMail(e.target.value) }} /><br></br>
                            <input className={notice.login} placeholder='Логин' type="text" value={userLogin} onChange={(e) => { setLogin(e.target.value) }} /><br></br>
                            <input className={notice.name} placeholder='Имя' type="text" value={userName} onChange={(e) => { setName(e.target.value) }} /><br></br>
                            <input className={notice.password} placeholder='Пароль' type="password" value={userPassword} onChange={(e) => { setPassword(e.target.value) }} />
                        </div>

                        <div className='btn-submit'>
                            <button onClick={onRegister} disabled={isLoading}>Зарегестрироваться</button>
                        </div>

                        <div className="notice">
                            <span>{notice.text}</span>
                        </div>
                    </div>
                    :
                    <div className='register-form'>
                        <div className="signin-link">
                            Отлично, теперь вы можете перейти к <Link to={'/signin'}>авторизации</Link>!
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
