import { Link, useLocation, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import '../styles/Header.css';
import { useEffect, useState } from "react";
import logo from '../assets/logo.png';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isAdmin) {
      localStorage.removeItem("isAdmin");
      setIsAdmin(false);
      navigate("/adminlogin");
    } else if (username) {
      try {
        await deleteDoc(doc(db, "login", username));
      } catch (err) {
        console.error("Error deleting user from Firestore:", err);
      }

      localStorage.removeItem("username");
      setUsername(null);
      navigate("/userlogin");
    }
  };

  return (
    <header className="game-header">
      <nav className="game-nav">
        <ul className="game-nav-list">
          <li className="logo-title">
            <Link className="game-link" to="/">
              <img src={logo} alt="KaandZone" className="header-logo"/>
              <span className="header-title">KaandZone</span>
            </Link>
          </li>

          {location.pathname === "/userlogin" && (
            <li>
              <Link className="game-link" to="/adminlogin">Admin Login</Link>
            </li>
          )}

          {location.pathname === "/adminlogin" && (
            <li>
              <Link className="game-link" to="/userlogin">User Login</Link>
            </li>
          )}

          {location.pathname === "/" && (username || isAdmin) ? (
            <li className="link-row">
              <Link className="game-link" to="/profile">Profile</Link>
              <Link className="game-link" to="/join-room">Join Room</Link>
              <Link className="game-link" to="/create-room">Create Room</Link>
              <a href="#" onClick={handleLogout}>Logout</a>
            </li>
          ) : location.pathname === "/" ? (
            <li>
              <Link className="game-link" to="/userlogin">Login</Link>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
