import React from 'react'
import btn from '../../../assets/img/ui/btn-menu-light.png'



function Header({ openMenu }) {
    return (
        <div className='app__header'>
            <div className="app__button-menu">
                <button onClick={openMenu}><img src={btn} alt="" /></button>
            </div>
            <div className="app__title">
                <h3>Мессенджер</h3>
            </div>
        </div>
    )
}

export default Header