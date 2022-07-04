import React from 'react'
import axios from 'axios'


import { useNavigate } from 'react-router'



export default function SignUp({ onLogin }) {
    const [userLogin, setLogin] = React.useState('')
    const [userName, setName] = React.useState('')
    const [userPassword, setPassword] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)
    const [error, setError] = React.useState('')

    let navigate = useNavigate()

    const onSignUp = async () => {

        if (!userLogin || !userName || !userPassword) {
            return console.log('Error:ghost')
        }
        const object = {
            userLogin,
            userName,
            userPassword
        }
        const result = await axios.post('/signup', object)

        if (!result.data) {
            setLoading(true);
            setError('')
            //onLogin(object)
            //navigate('/profile')

        } else {
            setError('Error')
        }
    }

    return (
        <div>
            Register

            <div>
                <input placeholder='Ваш login' type="text" value={userLogin} onChange={(e) => { setLogin(e.target.value) }} /><br></br>
                <input placeholder='Ваше имя' type="text" value={userName} onChange={(e) => { setName(e.target.value) }} /><br></br>
                <input placeholder='Пароль' type="password" value={userPassword} onChange={(e) => { setPassword(e.target.value) }} />
            </div>

            <div>
                <button onClick={onSignUp} disabled={isLoading}>Зарегестрироваться</button>
            </div>

            <div>{error}</div>
        </div>
    )
}
