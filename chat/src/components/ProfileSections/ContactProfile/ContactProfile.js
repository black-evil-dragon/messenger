import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import api from '../../../http/axios'
import socket from '../../../socket/socket'
import Header from '../../ui/Header/Header'


export default function ContactProfile({ userLogin, checkAuth, openMenu }) {
    const params = useParams()
    const navigate = useNavigate()
    const contactLogin = params.login

    const [notice, setNotice] = React.useState({ text: '', type: '' })
    const [contactInfo, setInfo] = React.useState({
        error: 'Загрузка'
    })

    const deleteContact = async () => {
        await api.post('/api/delete/contact', { userLogin, contactLogin })
        navigate('/contacts')
    }


    const findContact = (contacts) => {
        const contact = contacts.find(contact => contact.userLogin === contactLogin)
        contact ? setInfo(contact) : setInfo({
            error: 'Добавьте его в друзья, прежде чем открывать его профиль'
        })
    }
    const checkData = async () => {
        const response = await api.post('/api/update/data')
        if (response.data === '401C') {
            checkAuth()
        } else {
            findContact(response.data.contacts)
        }
    }

    const createChat = async () => {
        if (contactLogin) {
            const data = {
                userLogin,
                contactLogin,
                private: true
            }
            const response = await api.post('/api/chat/create', data)

            if (response.data !== '401C' & response.data !== '404C') {
                if (response.data === 'e_chat/exist') {
                    setNotice({ text: 'Упс, вы уже создали чат с этим пользователем' })
                    console.warn(response.data)
                    navigate('/')
                } else {
                    checkData()
                    socket.emit('chat:create', data)
                    setNotice({})
                    navigate('/')
                }
            } else {
                setNotice({ text: 'Упс, похоже произошла ошибка', type: 'danger' })
                console.warn(response.data)
            }
        } else {
            setNotice({ text: 'Упс, введите логин друга!', type: 'warning' })
        }
    }


    React.useEffect(() => {
        checkData()
    }, [])

    return (
        <div className='profile'>
            <Header openMenu={openMenu} />
            <div className='profile__content'>
                {!contactInfo.error ?
                    <>
                        <div className='profile__user'>
                            <h3>{contactInfo.userLogin}</h3>
                            <p>{contactInfo.userName}</p>
                        </div>
                        <button className='profile__button info send-message' onClick={createChat}>Написать</button>
                        <button className='profile__button danger' onClick={deleteContact}>Удалить из друзей</button>
                        {notice &&
                            <div className='profile__notice'>
                                <p className={notice.type}>{notice.text}</p>
                            </div>
                        }
                    </>
                    :
                    contactInfo.error !== 'Загрузка' &&

                    <div className="profile__notice">
                        <h3>Этот пользователь не открывал вам доступ</h3>
                        <p>{contactInfo.error}</p>
                        <Link to={'/contacts'} className='profile__link'>Добавить в список друзей</Link>
                    </div>

                }
            </div>
        </div>
    )
}