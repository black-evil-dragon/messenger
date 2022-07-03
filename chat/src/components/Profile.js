import React from 'react'

export default function Profile({ userLogin, userName, deleteCookie }) {

    return (
        <div>
            <div>
                Profile
                user: {userLogin}, {userName}
            </div>
            <br></br>
            <button onClick={deleteCookie}>Logout</button>
        </div>
    )
}