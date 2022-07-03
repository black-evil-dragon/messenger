import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="login">Login</Link> |{" "}
        <Link to="signup">Sign-up</Link>
    </nav>
  );
}