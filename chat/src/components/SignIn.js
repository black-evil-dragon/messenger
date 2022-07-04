import React from 'react'
import axios from 'axios';

export default function Login(onLogin) {
    return (
        <div>
            Login

            <div>
                <input type="text" /><br></br>
                <input type="text" />
            </div>

            <div>
                <button>Войти</button>
            </div>
        </div>
    )
}
