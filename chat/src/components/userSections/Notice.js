import React from 'react'

import api from '../../http/axios'
import Header from '../ui/Header'

export default function Notice(payload) {

    const {
        notice,
        isLogin,
        checkAuth,
        userLogin,
        addContact,
        checkData,
        openMenu
    } = payload

    const acceptInvite = async (contactLogin, type) => {
        const response = await api.post('/api/acceptInvite', { contactLogin, userLogin, type })

        if (response.data !== '200C') {
            addContact(response.data)
            checkData()
        }
    }

    const deleteNotice = async (contactLogin) => {
        await api.post('/api/delete/notice', { userLogin, contactLogin })
        checkData()
    }


    React.useEffect(() => {
        !isLogin && checkAuth()
        isLogin && checkData()
    }, [])

    return (
        <div className='notice-page'>
            <Header openMenu={openMenu} />
            <div className="notice-list">
                <h3>Уведомления</h3>
                <div className="invites">
                    <p className="title-notice"></p>
                    {notice.invites &&
                        notice.invites.map(function (d, idx) {
                            return (
                                <div className='invite' key={idx}>
                                    <p><span>{d.userLogin}</span> хочет добавить вас в друзья!</p>
                                    <button className='success' onClick={() => acceptInvite(d.userLogin, 'accept')}>Добавить</button>
                                    <button className='warning' onClick={() => acceptInvite(d.userLogin, 'decline')}>Отклонить</button>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="other-notice">
                    {notice.other &&
                        notice.other.map(function (d, idx) {
                            return (
                                <div className='notice' key={idx}>
                                    <p><span>{d.userLogin}</span> {d.type === 'acceptInvite' ? 'добавил вас в друзья' : d.type === 'declineInvite' ? 'отклонил заявку' : d.type === 'deleteContact' && 'удалил вас из списка друзей'}</p>
                                    <button className='accept' onClick={() => { deleteNotice(d.userLogin) }}>Хорошо!</button>
                                </div>
                            )
                        })
                    }
                </div>
                {(!notice.invites.length && !notice.other.length) && <p className="lone-wolf"><span>У вас нет уведомлений</span></p>}
            </div>
        </div>
    )
}
