import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilter } from '../../../hooks/useFilter'

import { nanoid } from 'nanoid'

import socket from '../../../socket/socket'

import Header from '../../ui/Header/Header'

export default function Contacts({ contacts, userLogin, checkAuth, checkData, openMenu }) {
    const navigate = useNavigate()

    const [contactLogin, setLogin] = React.useState('')
    const [notice, setNotice] = React.useState({})
    const [allUsers, setUsers] = React.useState([])

    const filterUsers = useFilter(allUsers, contactLogin)


    const sendInvite = async () => {
        contactLogin && socket.emit('user:send-invite', { from: userLogin, to: contactLogin, type: 'send-invite', id: `${nanoid()}` })
        setLogin('')
    }

    const nav = (target) => {
        navigate(`/user/${target}`)
    }


    React.useEffect(() => {
        checkData()
        socket.on('user:error', response => {
            console.log(response);
        })
    }, [])

    React.useEffect(() => {
        socket.on('users:get-users', response => {
            setUsers(response.data)
        })

    }, [allUsers])

    React.useMemo(() => {
        socket.emit('users:get-users', userLogin)
        if (!contactLogin) {
            setUsers([])
        }
    }, [contactLogin])

    return (
        <div className='friends'>
            <Header openMenu={openMenu} />
            <div className="friends__content">
                <h3 className='friends__title'>Найти друга</h3>

                <div className="friends__add-friend">
                    <input className={notice.type} placeholder='Логин друга' type="text" list='filterUsers' value={contactLogin} onChange={(e) => { setLogin(e.target.value) }} />
                    <datalist id='filterUsers'>
                        {contactLogin && filterUsers && filterUsers.map((user, key) =>
                            <option key={key} value={user.userLogin}>{user.userLogin} - {user.userName}</option>
                        )}
                    </datalist>

                    <div className="friends__button">
                        <button className='button-light' onClick={sendInvite}>Добавить</button>
                    </div>

                    <div className="friends__notice">
                        <p className={notice.type}>{notice.text}</p>
                    </div>
                </div>

                <div className="friends__list">
                    <h3 className='friends__title'>Друзья</h3>
                    {contacts.length ?
                        contacts.map(function (d, idx) {
                            return (
                                <div className='friends__friend-content' key={idx} onClick={() => nav(d.userLogin)}>
                                    <div className="friends__avatar">
                                    </div>
                                    <div className="friends__friend">
                                        <p>{d.userName} <span>{d.userLogin}</span></p>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <p className='lone-wolf'><span>Упс, у вас нет друзей</span></p>
                    }
                </div>
            </div>
        </div>
    )
}
