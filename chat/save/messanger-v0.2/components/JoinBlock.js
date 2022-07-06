import React from 'react'
//import socket from '../socket'
import axios from 'axios';



export default function JoinBlock({ onLogin }) {
    const [ID, setID] = React.useState('')
    const [userName, setUsername] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)

    const onEnter = async () => {
        if (!ID || !userName) {
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
        <div className='join-block'>
            <div className='join-panel'>
                <p>Welcome!</p>
                <div className="join-input">
                    <input placeholder='Chat ID' type="text" name="" id="" value={ID} onChange={(e) => { setID(e.target.value) }} /><br></br>
                    <input placeholder='Your name' type="text" name="" id="" value={userName} onChange={(e) => { setUsername(e.target.value) }} />
                </div>

                <div className="btn-join">
                    <button onClick={onEnter} disabled={isLoading}>
                        {isLoading ? 'Вход' : 'Войти'}
                    </button>
                </div>
            </div>
        </div>
    )
}
