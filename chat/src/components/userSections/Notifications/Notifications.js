import React from 'react'

import api from '../../../http/axios'
import Header from '../../ui/Header/Header'

// На самом деле код говно

export default function Notifications({ openMenu, socket, userLogin }) {
    const [noticeList, setNotice] = React.useState([])


    const replyInvite = (id, contactLogin, type) => {
        socket.emit('user:invite-response', { to: contactLogin, from: userLogin, type, id })
        socket.emit('user:update-notice')
    }

    const deleteNotice = notice => {
        socket.emit('user:delete-notice', notice)

        let index = noticeList.findIndex(value => value === notice)
        setNotice(noticeList.splice(index, 1))
        socket.emit('user:update-notice')
    }

    React.useEffect(() => {
        socket.emit('user:update-notice')

        socket.on('user:update-notice', response => setNotice(response))
        socket.on('user:send-notice', response => setNotice([...noticeList, response]))
    }, [])


    return (
        <div className='notifications'>
            <Header openMenu={openMenu} />
            <div className="notifications__content">
                <h3 className='notifications__title'>Уведомления</h3>
                <div className="notifications__invites">
                    {noticeList.length ?
                        noticeList.map(function (notice, id) {

                            return (notice.type === 'send-invite' ?
                                <div className='notifications__invite' key={id}>
                                    <p className='notifications__invite-title'><span>{notice.from}</span> хочет добавить вас в друзья!</p>
                                    <button className='notifications__button success' onClick={() => replyInvite(notice.id, notice.from, 'accept')}>Добавить</button>
                                    <button className='notifications__button warning' onClick={() => replyInvite(notice.id, notice.from, 'decline')}>Отклонить</button>
                                </div>
                                :
                                notice.type === 'notice' &&
                                <div className='notifications__invite' key={id} onClick={() => deleteNotice(notice)}>
                                    <p className='notifications__invite-title'><span>{notice.from}</span> {notice.text}</p>
                                </div>
                            )
                        }) :
                        <p className="lone-wolf"><span>У вас нет уведомлений</span></p>
                    }
                </div>
            </div>
        </div>
    )
}
