import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRef } from "react";

export default function Navigation({ url, showMenu }) {
    const navigate = useNavigate()
    const ref = useRef(null);

    const nav = (target) => {
        target &&
            showMenu()
        navigate(target)
    }

    React.useEffect(() => {
        const handleClick = event => {
            showMenu()
        };

        const element = ref.current;

        element.addEventListener('click', handleClick);
    }, [])
    return (
        <div className="navigation-bar">
            <div className="btn-nav">
                <button onClick={() => nav('/')}>Главная</button>
                <button onClick={() => nav('/messages')}>Мессенджер</button>
                <button onClick={() => nav('/notice')}>Уведомление</button>
                <button onClick={() => nav('/contacts')}>Друзья</button>
                <button onClick={() => nav(url)}>Профиль</button>
                <div ref={ref} className="closeModal close"></div>
            </div>
        </div>
    );
}