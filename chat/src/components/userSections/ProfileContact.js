import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import api from '../../http/axios'
import socket from '../../socket/socket'
import Header from '../ui/Header'


function ProfileContact({ userLogin, checkAuth, openMenu }) {
    const params = useParams()
    const navigate = useNavigate()
    const contactLogin = params.login

    const [notice, setNotice] = React.useState({ text: '', type: '' })
    const [contactInfo, setInfo] = React.useState({
        error: 'Загрузка'
    })

    const deleteContact = async (contactLogin) => {
        await api.post('/api/delete/contact', { userLogin, contactLogin })
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
                    socket.emit('chat:create', data)
                    checkData()
                    setNotice({})
                    navigate('/messages')

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
        <div className='profile-page'>
            <Header openMenu={openMenu} />
            <div className='profile-info'>
                {!contactInfo.error ?
                    <>
                        <div className='profile-user'>
                            <h3>{contactInfo.userLogin}</h3>
                            <p>{contactInfo.userName}</p>
                        </div>
                        <button className='info send-message' onClick={createChat}>Написать</button>
                        <button className='danger'>Удалить из друзей</button>
                        {notice &&
                            <div className='notice'>
                                <p className={notice.type}>{notice.text}</p>
                            </div>
                        }
                    </>
                    :
                    contactInfo.error !== 'Загрузка' &&

                    <div className="notice">
                        <h3>Этот пользователь не открывал вам доступ</h3>
                        <p>{contactInfo.error}</p>
                        <Link to={'/contacts'}>Добавить в список друзей</Link>
                    </div>

                }
            </div>
        </div>
    )
}

export default ProfileContact

/*



*/