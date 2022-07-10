import React from 'react'
import axios from 'axios';


export default function SignIn({onLogin, navigate}) {
    const [userLogin, setLogin] = React.useState('')
    const [userPassword, setPassword] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)
    const [error, setError] = React.useState('')


    const onSignIn = async () => {

        if (!userLogin || !userPassword) {
            return console.log('Error:ghost')
        }
        const object = {
            userLogin,
            userPassword
        }
        const result = await axios.post('/signin', object)

        if (result.status !== 401) {
            const user = {
                userLogin: userLogin,
            }
            setLoading(true);
            setError('')
            onLogin(user, true)

        } else {
            setError('Error')
        }
    }

    return (
        <div>
            Login

            <div>
                <input placeholder='Ваш login' type="text" value={userLogin} onChange={(e) => { setLogin(e.target.value) }} /><br></br>
                <input placeholder='Пароль' type="password" value={userPassword} onChange={(e) => { setPassword(e.target.value) }} />
            </div>

            <div>
                <button onClick={onSignIn} disabled={isLoading}>Войти</button>
            </div>

            <div>{error}</div>
        </div>
    )
}
