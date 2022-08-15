import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import api from '../../../http/axios'
import socket from '../../../socket/socket'

import ChatBox from './ChatBox/ChatBox'
import Header from '../../ui/Header/Header'

function Messenger({ chats, userLogin, checkAuth, isLogin, openMenu }) {

    const params = useParams()
    const navigate = useNavigate()

    const [contactLogin, setLogin] = React.useState('')
    const [notice, setNotice] = React.useState({})
    const [checked, setChecked] = React.useState(true);
    const [chatData, setChatData] = React.useState({})

    const [selectedElement, selectThisElement] = React.useState()


    const setPrivate = (e) => {
        setChecked(!checked);
        e.target.checked = checked
    }

    const createChat = async () => { // Код не крутой, осуждаю
        if (contactLogin) {
            const data = {
                userLogin,
                contactLogin,
                private: checked
            }
            const response = await api.post('/api/chat/create', data)

            if (response.data !== '401C' & response.data !== '404C') {
                if (response.data === 'e_chat/exist') {
                    setNotice({ text: 'Упс, вы уже создали чат с этим пользователем', type: 'warning' })
                    console.warn(response.data)
                } else {
                    socket.emit('chat:create', data)
                    setChatData(checkData())
                    setNotice({})
                    setLogin('')
                }
            } else {
                setNotice({ text: 'Упс, похоже произошла ошибка', type: 'dangers' })
                console.warn(response.data)
            }
        } else {
            setNotice({ text: 'Упс, введите логин друга!', type: 'warning' })
        }
    }

    const checkData = async () => {
        const response = await api.post('/api/update/data')
        if (response.data === '401C') {
            checkAuth()
        } else {
            await setChatData(response.data.chats)
        }
    }

    const test = () => {
        socket.emit('chat:create', {
            userLogin: 'blackevildragon',
            contactLogin: 'spookymonkey',
            private: checked
        })
    }

    const selectChat = (chat, id) => {
        const chatElements = document.querySelectorAll('.messenger__chat')

        chatElements.forEach(element => {
            if (element.getAttribute('chat-id') === `${id}`) {
                element.classList.toggle('selected')

                selectedElement !== element ? selectThisElement(element) : selectThisElement(undefined)
            } else {
                element.classList.remove('selected')
            }
        });

        setChatData(chat)
        checkData()
    }

    React.useEffect(() => {
        checkData()
    }, [])

    /*
    const openMenu = () => {
        const panel = document.querySelector('.chat-list')
        panel.classList.toggle('open')

        if (panel.style.maxWidth) {
            panel.style.maxWidth = null
        } else {
            panel.style.width = '100%'
            panel.style.maxWidth = `${panel.scrollWidth}px`
        }
    }
    */

    return (
        <>
            {isLogin &&
                <div className="messenger">
                    <div className="messenger__content">
                        <Header openMenu={openMenu} />
                        <div className='messenger__add-chat'>
                            <input className={notice.type} placeholder='Логин друга' type="text" value={contactLogin} onChange={(e) => { setLogin(e.target.value) }} />
                            <button className='messenger__button' onClick={createChat}>+</button> <br></br>
                        </div>

                        <div className="messenger__notice">
                            <p className={notice.type}>{notice.text}</p>
                        </div>

                        <div className="messenger__chats">
                            {chats.length ?
                                chats.map(function (chat, id) {
                                    return (
                                        <div className='messenger__chat' chat-id={id} key={id} onClick={() => { selectChat(chat, id) /* Святой код, не трогай */ }}>
                                            <div className="messenger__chat-icon"></div>
                                            <div className="messenger__chat-preview">
                                                <p className='messenger__chat-name'>{chat.chatName}</p>
                                                <p className='messenger__chat-message'>Привет, как ты?</p>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <p className='messenger__empty-text lone-wolf'><span>Упс, у вас нет чатов</span></p>
                            }
                        </div>
                    </div>
                    <ChatBox params={params} checkAuth={checkAuth} />
                </div>
            }
        </>
    )
}


export default Messenger

/*
<input type="radio" onClick={setPrivate} />
<span title='Создать беседу'>Беседа</span>
*/