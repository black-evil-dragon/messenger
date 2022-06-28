import React from 'react'
import socket from '../socket'
import axios from 'axios';


export default function JoinBlock({ onLogin }) {
    const [ID, setID] = React.useState('')
    const [userName, setUsername] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)

    const onEnter = async () => {
        if(!ID || !userName){
            return console.log('Error:ghost')
        }
        setLoading(true);
        const object = {
            ID,
            userName
        }
        await axios.post('/', object)
        onLogin(object)
    }
    return (
        <div>
            <input type="text" name="" id="" value={ID} onChange={(e) => { setID(e.target.value) }} /><br></br>
            <input type="text" name="" id="" value={userName} onChange={(e) => { setUsername(e.target.value) }} /><br></br>
            <button onClick={onEnter} disabled={isLoading}>
                {isLoading ? 'Вход' : 'Войти'}
            </button>
        </div>
    )
}
