import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import api from '../../http/axios'
import socket from '../../socket/socket'

import ChatBox from './ChatBox'
import Header from '../ui/Header'

function Messenger({ chats, userLogin, checkAuth, isLogin, openMenu }) {

    const params = useParams()
    const navigate = useNavigate()

    const [contactLogin, setLogin] = React.useState('')
    const [notice, setNotice] = React.useState({})
    const [checked, setChecked] = React.useState(true);
    const [data, setData] = React.useState({})


    const setPrivate = (e) => {
        setChecked(!checked);
        e.target.checked = checked
    }

    const createChat = async () => {
        if (contactLogin) {
            const data = {
                userLogin,
                contactLogin,
                private: checked
            }
            const response = await api.post('/api/chat/create', data)

            if (response.data !== '401C' & response.data !== '404C') {
                if (response.data === 'e_chat/exist') {
                    setNotice({ text: 'Упс, вы уже создали чат с этим пользователем' })
                    console.warn(response.data)
                } else {
                    socket.emit('chat:create', data)
                    setData(checkData())
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

    const setChatData = async (chats) => {
        const chat = chats.find(chat => chat.chatID === params.id)
        await setData(chat)
        console.log(data, chats, params.id, chat)
    }

    const checkData = async () => {
        const response = await api.post('/api/update/data')
        if (response.data === '401C') {
            checkAuth()
        } else {
            setChatData(response.data.chats)
        }
    }

    const test = () => {
        socket.emit('chat:create', {
            userLogin: 'blackevildragon',
            contactLogin: 'spookymonkey',
            private: checked
        })
    }

    const selectChat = ({ chatName, chatID }) => {
        const url = `/chat_${chatName}/id${chatID}`
        checkData()

        navigate(url)
    }


    React.useEffect(() => {
        !isLogin && checkAuth()
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
                <div className="messenger-page">
                    <div className="messenger-contacts">
                        <Header openMenu={openMenu} />
                        <div className={'create-chat'}>
                            {!chats.length && <>
                                <h3>Создайте новый чат!</h3>
                                <input className={notice.type} placeholder='Логин друга' type="text" value={contactLogin} onChange={(e) => { setLogin(e.target.value) }} />
                                <button onClick={createChat}>Добавить</button> <br></br>

                                <input type="radio" onClick={setPrivate} />
                                <span title='Создать беседу'>Беседа</span>

                                <div className="notice">
                                    <p className={notice.type}>{notice.text}</p>
                                </div>
                            </>}
                        </div>
                        <div className="messenger-chats">
                            {chats.length ?
                                chats.map(function (chat, id) {
                                    return (
                                        <div className='chat' key={id}>
                                            <button onClick={() => { selectChat(chat) }}>{chat.chatName}</button>
                                        </div>
                                    )
                                })
                                :
                                <p className='lone-wolf'><span>Упс, у вас нет чатов</span></p>
                            }
                        </div>
                    </div>
                    <ChatBox params={params} checkAuth={checkAuth} data={data}/>
                </div>
            }
        </>
    )
}


export default Messenger