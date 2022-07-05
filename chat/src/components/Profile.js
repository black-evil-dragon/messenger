import React from 'react'
import axios from 'axios'


export default function Profile({ userLogin, userName, deleteCookie, giveContacts, contacts }) {
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
                Profile
                user: {userLogin}, {userName}
            </div>
            <br></br>
            <button onClick={deleteCookie}>Logout</button>
            <br></br>
            <br></br>
            <div>
                Contacts
                <div>
                    {contacts.map(function (d, idx) {
                        return (<li key={idx}>{d.userLogin}</li>)
                    })}
                </div>
            </div>
            <br></br>
            <br></br>
            <div>
                <input type="text" value={contactLogin} onChange={(e) => setContact(e.target.value)} />
                <button onClick={addContact}>Добавить контакт</button>
            </div>
            <div>{notice}</div>
        </div>
    )
}

/*
{data.map(function(d, idx){
    return (li key idx {d.userLogin})
})}

*/