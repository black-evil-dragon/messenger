import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Friend({ friend }) {
    const navigate = useNavigate()
    return (
        <div className='friend' onClick={() => navigate(`/user/${friend.userLogin}`)}>
            <div className="friend__avatar"></div>
            <div className="friend__username">
                <p>
                    {friend.userName}
                    <span>{friend.userLogin}</span>
                </p>
            </div>
        </div>
      )
}

/*
<div className='friends__friend-content' key={idx} onClick={() => nav(d.userLogin)}>
    <div className="friends__avatar"></div>
    <div className="friends__friend">
        <p>{d.userName} <span>{d.userLogin}</span></p>
    </div>
</div>
*/

