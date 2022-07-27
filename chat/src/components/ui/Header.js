import React from 'react'
import btn from '../../assets/img/ui/btn-menu.png'

function Header({ openMenu }) {
    return (
        <div className='app-header'>
            <div className="app-btn">
                <button onClick={openMenu}><img src={btn} alt="" /></button>
            </div>
            <div className="app-title">
                <h3>Мессенджер</h3>
            </div>
        </div>
    )
}

export default Header