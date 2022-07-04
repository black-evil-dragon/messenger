import { Link } from "react-router-dom";

export default function NavBar({url}) {
    return (
        <nav>
            <Link to="/">Home</Link> |{" "}
            <Link to="signin">Sign-in</Link> |{" "}
            <Link to="signup">Sign-up</Link> |{" "}
            <Link to={url}>Profile</Link>
        </nav>
    );
}