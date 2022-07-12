import React from 'react'
import axios from 'axios';
import checkEmail from '../config/checkEmail';
import { useNavigate } from 'react-router';


export default function SignIn({ onLogin }) {
    const [userMail, setMail] = React.useState('user@mail.ru')
    const [userPassword, setPassword] = React.useState('1')
    const [isLoading, setLoading] = React.useState(false)
    const [notice, setNotice] = React.useState('')

    let navigate = useNavigate()
    const homePage = () => navigate('/')


    const onAuth = () => {
        if (!userMail || !userPassword) {
            setNotice('Упс, похоже вы не заполнили форму!')
        } else {
            if (checkEmail(userMail)) {
                const user = {
                    userMail: userMail,
                    userPassword: userPassword
                }
                setNotice('')
                setLoading(true)

                authUser(user)
            } else {
                setLoading(false)
                setNotice('Упс, вы похоже неправильно ввели свою почту!')
            }
        }
    }

    const authUser = async (user) => {
        const response = await axios.post('/api/signin', user)
        if(response.data.response){
            onLogin(response.data.user_data)
            localStorage.setItem('token', response.data.tokens.accessToken)
            homePage()
        }
    }



    return (
        <div>
            Login

            <div>
                <input placeholder='Ваша почта' type="text" value={userMail} onChange={(e) => { setMail(e.target.value) }} /><br></br>
                <input placeholder='Пароль' type="password" value={userPassword} onChange={(e) => { setPassword(e.target.value) }} />
            </div>

            <div>
                <button onClick={onAuth} disabled={isLoading}>Войти</button>
            </div>

            <div>{notice}</div>
        </div>
    )
}

