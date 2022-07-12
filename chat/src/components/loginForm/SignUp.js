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
    const [notice, setNotice] = React.useState('')

    const onRegister = () => {
        if (!userMail || !userLogin || !userName || !userPassword) {
            setNotice('Упс, похоже вы не заполнили форму!')
        } else {
            if (checkEmail(userMail)) {
                const user = {
                    userMail: userMail,
                    userLogin: userLogin,
                    userName: userName,
                    userPassword: userPassword
                }
                setNotice('')
                setLoading(true)
                registerUser(user)
            } else {
                setLoading(false)
                setNotice('Упс, вы похоже неправильно ввели свою почту!')
            }

        }
    }

    const registerUser = async (user) => {
        const response = await axios.post('/api/signup', user)
        if (!response.data) {
            setLoading(false)
            setNotice('Упс, такой пользователь уже существует')
        } else {
            setRegister(true)
            setLoading(true)
        }
    }

    return (
        <div>
            Register

            {!isRegister
                ?
                <div>
                    <div>
                        <input placeholder='Ваш email' type="text" value={userMail} onChange={(e) => { setMail(e.target.value) }} /><br></br>
                        <input placeholder='Ваш логин' type="text" value={userLogin} onChange={(e) => { setLogin(e.target.value) }} /><br></br>
                        <input placeholder='Ваше имя' type="text" value={userName} onChange={(e) => { setName(e.target.value) }} /><br></br>
                        <input placeholder='Пароль' type="password" value={userPassword} onChange={(e) => { setPassword(e.target.value) }} />
                    </div>

                    <div>
                        <button onClick={onRegister} disabled={isLoading}>Зарегестрироваться</button>
                    </div>
                </div>
                :
                <div>Отлично, теперь вы можете перейти к <Link to={'/signin'}>авторизации</Link>!</div>
            }

            <div>{notice}</div>
        </div>
    )
}
