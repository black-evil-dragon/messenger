import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilter } from '../../../hooks/useFilter'

import { nanoid } from 'nanoid'

import socket from '../../../socket/socket'

import Header from '../../ui/Header'
import Friend from '../../ui/Friend'

export default function Contacts({ userContacts, userLogin, checkData, openMenu }) {
    const [contactLogin, setLogin] = React.useState('')
    const [notice, setNotice] = React.useState({})
    const [allUsers, setUsers] = React.useState([])

    const filterUsers = useFilter(allUsers, contactLogin)


    const sendInvite = async () => {
        contactLogin && socket.emit('user:send-invite', { from: userLogin, to: contactLogin, type: 'send-invite', id: `${nanoid()}` })
        setLogin('')
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
    }, [contactLogin, userLogin])

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

                <div className="friends__title">
                    <h3>Друзья</h3>
                </div>
                <div className="friends__list">

                    {userContacts.length ?
                        userContacts.map(function (friend, id) {
                            return (
                                <Friend key={id} friend={friend} />
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
