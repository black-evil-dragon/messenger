import React from 'react'

import api from '../http/axios'
import axios from 'axios'

export default function Contacts({ contacts, userLogin, checkAuth, checkData }) {
    const [contactLogin, setLogin] = React.useState('')
    const [notice, setNotice] = React.useState({})


    const sendInvite = async () => {
        if (contactLogin) {
            const response = await api.post('/api/auth')
            if (response.status === 401) {
                checkAuth(localStorage.getItem('token'))
            } else {
                setNotice({})

                const response = await api.get('/api/invite', {
                    params: {
                        contactLogin: contactLogin,
                        userLogin: userLogin
                    }
                })

                if (response.data === '200C') {
                    setNotice({ text: 'Вы уже пригласили его)', type: 'danger' })
                }

                if (response.data === '404C') {
                    setNotice({ text: 'Такого логина нет', type: 'danger' })
                }

                setLogin('')
            }
        } else {
            setNotice({ text: 'Введите логин друга!', type: 'danger' })
        }
        if (contactLogin === userLogin) {
            setNotice({ text: 'Это ваш логин)', type: 'warning' })
        }
    }

    const deleteContact = async (contactLogin) => {
        await api.post('/api/delete/contact', { userLogin, contactLogin})
        checkData()
    }

    React.useEffect(() => {
        checkData()
    }, [])

    return (
        <div className='contact-page'>
            <div className="contact-list">
                <h3>Найти друга</h3>

                <div className="add-contact">
                    <input className={notice.type} placeholder='Логин друга' type="text" value={contactLogin} onChange={(e) => { setLogin(e.target.value) }} />
                    <button onClick={sendInvite}>Добавить</button>
                    <div className="notice">
                        <p className={notice.type}>{notice.text}</p>
                    </div>
                </div>

                <div className="contacts">
                    <h3>Друзья</h3>
                    {contacts.length ?
                        contacts.map(function (d, idx) {
                            return (
                                <div className='contact' key={idx}>
                                    <p>{d.userName} <span>{d.userLogin}</span></p>
                                    <button className='warning' onClick={() => { deleteContact(d.userLogin)}}>Удалить</button>
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
