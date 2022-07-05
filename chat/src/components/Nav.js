import { Link } from "react-router-dom";

export default function NavBar({url}) {
    return (
        <nav>
            <Link to="/">Главная</Link> |{" "}
            <Link to="signin">Войти</Link> |{" "}
            <Link to="signup">Зарегестрироваться</Link> |{" "}
            <Link to={url}>Профиль</Link> |{" "}
            <Link to="contacts">Добавить контакт</Link>
        </nav>
    );
}