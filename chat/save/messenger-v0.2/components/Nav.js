import { Link } from "react-router-dom";

export default function Navigation({ url, isLogin, userLogin }) {
    const onLogin =
        <nav>
            <Link to="/">Главная</Link> |{" "}
            <Link to="signin">Войти</Link> |{" "}
            <Link to="signup">Зарегестрироваться</Link> |{" "}
            <Link to="contacts">Добавить контакт</Link>
        </nav>
    const noLogin =
        <nav>
            <Link to="/">Главная</Link> |{" "}
            <Link to={url}>{userLogin}</Link> |{" "}
            <Link to="contacts">Добавить контакт</Link>
        </nav>
    return (
        <div>
            {!isLogin ? <div>{onLogin}</div> : <div>{noLogin}</div>}
        </div>
    );
}