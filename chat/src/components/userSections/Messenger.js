import React from 'react'

import api from '../../http/axios'

import ChatBox from './ChatBox'

function Messenger({ chats, userLogin }) {

    const [contactLogin, setLogin] = React.useState('')
    const [notice, setNotice] = React.useState({})
    const [checked, setChecked] = React.useState(true);


    const setPrivate = (e) => {
        setChecked(!checked);
        e.target.checked = checked // почему-то при выборе, он выводит false, а иначе true
    }

    const createChat = async () => {
        if (contactLogin) {
            const response = await api.post('/api/chat/create', {
                userLogin,
                contactLogin,
                type: !checked
            })
            console.log(response.data);
            setNotice({})
            setLogin('')
        } else {
            setNotice({ text: 'Упс, введите логин друга!', type: 'warning' })
        }
    }


    return (
        <div className="messenger-page">
            <div className="messenger-contacts">
                <div className="create-chat">
                    {!chats.lendth && <h3>Создайте новый чат!</h3>}
                    <input className={notice.type} placeholder='Логин друга' type="text" value={contactLogin} onChange={(e) => { setLogin(e.target.value) }} />
                    <button onClick={createChat}>Добавить</button> <br></br>
                    <input type="radio" onClick={setPrivate} />
                    <span title='Сделать общий чат'>Беседа</span>

                    <div className="notice">
                        <p className={notice.type}>{notice.text}</p>
                    </div>
                </div>
                <div className="messenger-chats"></div>
            </div>
            <ChatBox />
        </div>
    )
}

export default Messenger