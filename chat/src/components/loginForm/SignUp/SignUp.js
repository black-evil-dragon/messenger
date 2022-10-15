import React from 'react'


import axios from 'axios'
import { Link } from 'react-router-dom'

import { checkEmail, isIntroduce } from '../service/checkValid'

export default function SignUp() {
    const [userMail, setMail] = React.useState('')
    const [userLogin, setLogin] = React.useState('')
    const [userName, setName] = React.useState('')
    const [userPassword, setPassword] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)
    const [isRegister, setRegister] = React.useState(false)
    const [notice, setNotice] = React.useState({})

    const onRegister = () => {
        const payload = {
            userMail,
            userLogin,
            userName,
            userPassword
        }

        const error = isIntroduce(payload, 'signup')
        if (error) {
            setNotice(error)
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
                setNotice({ text: 'Упс, вы похоже неправильно ввели свою почту!', mail: 'error' })
            }
        }

    }

    const registerUser = async user => {
        const response = await axios.post('/api/signup', user)

        if (response.data.status === 200) {
            if (response.data.error) {
                setLoading(false)
                setNotice({ text: response.data.error })
            } else {
                setRegister(true)
                setLoading(true)
            }
        } else {
            setLoading(false)
            setNotice({ text: response.data.text })

            console.warn(response.data.error)
        }
    }

    return (
        <div className="register">
            {!isRegister
                ?
                <div className='register__form'>
                    <h3>Регистрация</h3>
                    <div className='register__input'>
                        <input className={notice.mail} placeholder='E-mail' type="email" autoComplete="off" value={userMail} onChange={(e) => { setMail(e.target.value) }} /><br></br>
                        <input className={notice.login} placeholder='Логин' type="text" autoComplete="off" value={userLogin} onChange={(e) => { setLogin(e.target.value) }} /><br></br>
                        <input className={notice.name} placeholder='Имя' type="text" autoComplete="off" value={userName} onChange={(e) => { setName(e.target.value) }} /><br></br>
                        <input className={notice.password} placeholder='Пароль' type="password" autoComplete="off" value={userPassword} onChange={(e) => { setPassword(e.target.value) }} />
                    </div>

                    <div className='register__button'>
                        <button className='button-dark' onClick={onRegister} disabled={isLoading}>Зарегестрироваться</button>
                    </div>

                    <div className="register__notice">
                        <span>{notice.text}</span>
                    </div>
                </div>
                :
                <div className='register__form'>
                    <div className="regiser__signin-link">
                        Отлично, теперь вы можете перейти к <Link to={'/signin'}>авторизации</Link>!
                    </div>
                </div>
            }
        </div>
    )
}
