import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <nav>
            <Link to="/signin">Войти</Link>
            {' | '}
            <Link to="/signup">Зарегестрироваться</Link>
        </nav>
    );
}