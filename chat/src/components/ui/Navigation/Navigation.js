import React from "react";
import { useNavigate } from "react-router-dom";
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
        <div className="navigation">
            <div className="navigation__content">
                <button className="navigation__button" onClick={() => nav('/')}>Главная</button>
                <button className="navigation__button" onClick={() => nav('/notice')}>Уведомление</button>
                <button className="navigation__button" onClick={() => nav('/contacts')}>Друзья</button>
                <button className="navigation__button" onClick={() => nav(url)}>Профиль</button>
                <div ref={ref} className="navigation__closeNavigation"></div>
            </div>
            <div className="navigation__background"></div>
        </div>
    );
}