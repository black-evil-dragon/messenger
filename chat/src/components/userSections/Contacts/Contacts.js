import React from 'react'

import api from '../../../http/axios'
import { useNavigate } from 'react-router-dom'

import Header from '../../ui/Header/Header'

export default function Contacts({ contacts, userLogin, checkAuth, checkData, openMenu }) {

    const [contactLogin, setLogin] = React.useState('')
    const [notice, setNotice] = React.useState({})

    const navigate = useNavigate()


    const sendInvite = async () => {
        if (contactLogin) {
            const response = await api.post('/api/auth')
            if (response.status === 401) {
                checkAuth(localStorage.getItem('token')) // че? я это писал?
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

    const nav = (target) => {
        navigate(`/user/${target}`)
    }


    React.useEffect(() => {
    }, [])


    return (
        <div className='friends'>
            <Header openMenu={openMenu}/>
            <div className="friends__content">
                <h3 className='friends__title'>Найти друга</h3>

                <div className="friends__add-friend">
                    <input className={notice.type} placeholder='Логин друга' type="text" value={contactLogin} onChange={(e) => { setLogin(e.target.value) }} />
                    <button className='friends__button' onClick={sendInvite}>Добавить</button>

                    <div className="friends__notice">
                        <p className={notice.type}>{notice.text}</p>
                    </div>
                </div>

                <div className="friends__list">
                    <h3 className='friends__title'>Друзья</h3>
                    {contacts.length ?
                        contacts.map(function (d, idx) {
                            return (
                                <div className='friends__friend-content' key={idx}>
                                    <p>{d.userName} <span>{d.userLogin}</span></p>
                                    <button className='friends__button info' onClick={() => nav(d.userLogin)}>Дополнительно</button>
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
