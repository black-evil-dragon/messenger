import { useNavigate, Link } from "react-router-dom";

export default function Navigation({ url }) {
    const navigate = useNavigate()
    return (
        <div className="navigation-bar">
            <button onClick={() => navigate('/')}>Главная</button>
            <button onClick={() => navigate('/notice')}>Уведомление</button>
            <button onClick={() => navigate('/contacts')}>Друзья</button>
            <button onClick={() => navigate(url)}>Профиль</button>
        </div>
    );
}