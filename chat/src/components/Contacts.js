import React from 'react'

import axios from 'axios'

export default function Contacts({giveContacts, userLogin}) {
    const [contactLogin, setContact] = React.useState('')
    const [notice, setNotice] = React.useState('')


    const addContact = async () => {
        const object = {
            contactLogin: contactLogin,
            userLogin: userLogin
        }
        const result = await axios.post('/getcontact', object)
        if (!result.data) {
            giveContacts(object)
            setNotice('Success!')

        } else {
            setNotice(result.data)
        }
        setContact('')
    }
    return (
        <div>
            <div>
                <input type="text" value={contactLogin} onChange={(e) => setContact(e.target.value)} />
                <button onClick={addContact}>Добавить контакт</button>
            </div>
            <div>{notice}</div>
        </div>
    )
}
