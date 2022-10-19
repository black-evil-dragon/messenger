import React from 'react'
import { useNavigate } from 'react-router';

import axiosAPI from '../../../http/axios'
import { checkEmail, isIntroduce } from '../service/checkValid';

export default function SignIn({ onLogin }) {
    const [userMail, setMail] = React.useState('')
    const [userPassword, setPassword] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)
    const [notice, setNotice] = React.useState({})

    let navigate = useNavigate()
    const homePage = () => navigate('/')

    const onAuth = () => {
        const payload = {
            userMail,
            userPassword
        }

        const error = isIntroduce(payload, 'signin')

        if (error) {
            setNotice(error)
        } else {
            if (checkEmail(userMail)) {
                const user = {
                    userMail: userMail,
                    userPassword: userPassword
                }
                setNotice({})
                setLoading(true)

                authUser(user)
            } else {
                setLoading(false)
                setNotice({ text: 'Упс, вы похоже неправильно ввели свою почту!', mail: 'error' })
            }
        }
    }

    const authUser = async (user) => {
        const response = await axiosAPI.post('/signin', user)

        if(response.data.status === 200) {
            if(response.data.error) {
                setLoading(false)
                setNotice({ text: response.data.text, mail: 'error' })

                console.warn(response.data);
            } else {
                onLogin(response.data.userData, false)
                localStorage.setItem('token', response.data.token)
                homePage()
            }
        } else {
            setLoading(false)
            setNotice({ text: 'Ошибка авторизации пользователя на сервере', mail: '' })
            console.warn(response.data.textError)
        }
    }

    return (
        <div className='login'>
            <div className="login__form">
                <h3 className='login__title'>Авторизация</h3>
                <div className='login__input'>
                    <input className={notice.mail} placeholder='Ваша почта' type="text" value={userMail} onChange={(e) => { setMail(e.target.value) }} /><br></br>
                    <input className={notice.password} placeholder='Пароль' type="password" value={userPassword} onChange={(e) => { setPassword(e.target.value) }} />
                </div>

                <div className='login__button'>
                    <button className='button-dark' onClick={onAuth} disabled={isLoading}>Войти</button>
                </div>

                <div className='login__notice'>
                    <span>{notice.text}</span>
                </div>
            </div>
        </div>
    )
}

