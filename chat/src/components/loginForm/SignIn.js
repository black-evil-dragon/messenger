import React from 'react'
import axios from 'axios';
import checkEmail from '../config/checkEmail';
import { useNavigate } from 'react-router';


export default function SignIn({ onLogin }) {
    const [userMail, setMail] = React.useState('')
    const [userPassword, setPassword] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)
    const [notice, setNotice] = React.useState({})

    let navigate = useNavigate()
    const homePage = () => navigate('/')

    const onAuth = () => {
        if (!userMail) {
            setNotice({ text: 'Упс, похоже вы не ввели свою почту!', mail: 'error-mail' })
        } else if(!userPassword){
            setNotice({ text: 'Упс, похоже вы не ввели свой пароль!', password: 'error-password' })
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
                setNotice({ text: 'Упс, вы похоже неправильно ввели свою почту!', mail: 'error-mail' })
            }

        }
    }

    const authUser = async (user) => {
        const response = await axios.post('/api/signin', user)

        if (response.data.response) {
            onLogin(response.data.userData, true)
            localStorage.setItem('token', response.data.token)
            homePage()
        }
    }



    return (
        <div className='login-page'>
            <div className="login-form">
                <h3>Авторизация</h3>
                <div className='login-input'>
                    <input className={notice.mail} placeholder='Ваша почта' type="text" value={userMail} onChange={(e) => { setMail(e.target.value) }} /><br></br>
                    <input className={notice.password} placeholder='Пароль' type="password" value={userPassword} onChange={(e) => { setPassword(e.target.value) }} />
                </div>

                <div className='btn-submit'>
                    <button onClick={onAuth} disabled={isLoading}>Войти</button>
                </div>

                <div className='notice'>
                    <span>{notice.text}</span>
                </div>
            </div>
        </div>
    )
}

