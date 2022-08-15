import React from 'react'

import api from '../../../http/axios'
import Header from '../../ui/Header/Header'

// На самом деле код говно

export default function Notifications(payload) {

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


    React.useEffect(() => {
        !isLogin && checkAuth()
        isLogin && checkData()
    }, [])

    return (
        <div className='notifications'>
            <Header openMenu={openMenu} />
            <div className="notifications__content">
                <h3 className='notifications__title'>Уведомления</h3>
                <div className="notifications__invites">
                    {notice.invites &&
                        notice.invites.map(function (d, idx) {
                            return (
                                <div className='notifications__invite' key={idx}>
                                    <p className='notifications__invite-title'><span>{d.userLogin}</span> хочет добавить вас в друзья!</p>
                                    <button className='notifications__button success' onClick={() => acceptInvite(d.userLogin, 'accept')}>Добавить</button>
                                    <button className='notifications__button warning' onClick={() => acceptInvite(d.userLogin, 'decline')}>Отклонить</button>
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

/*
    const deleteNotice = async (contactLogin) => {
        await api.post('/api/delete/notice', { userLogin, contactLogin })
        checkData()
    }

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

*/
