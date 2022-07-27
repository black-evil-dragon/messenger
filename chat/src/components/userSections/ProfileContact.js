import React from 'react'
import { Link, useParams } from 'react-router-dom'

import api from '../../http/axios'


function ProfileContact({ userLogin, checkAuth }) {
    let contacts
    const params = useParams()
    const contactLogin = params.login

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
        if(response.data === '401C') {
            checkAuth()
        } else {
            findContact(response.data.contacts)
        }
    }


    React.useEffect(() => {
        checkData()
    }, [])

    return (
        <div className='profile-page'>
            <div className='profile-info'>
                {!contactInfo.error ?
                    <>
                        <div className='profile-user'>
                            <h3>{contactInfo.userLogin}</h3>
                            <p>{contactInfo.userName}</p>
                        </div>
                        <button className='info send-message'>Написать</button>
                        <button className='danger'>Удалить из друзей</button>
                    </>
                    :
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