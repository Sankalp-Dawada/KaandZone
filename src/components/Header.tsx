import { Link } from "react-router-dom";
import '../styles/Header.css';

function Header(){
    return(
        <>
        <header className="game-header">
            <nav className="game-nav">
                <ul className="game-nav-list">
                    <li>
                        <Link className="game-home" to="/">KaandZone</Link>
                    </li>
                    {window.location.pathname === "/userlogin" && (
                        <li>
                            <Link className="game-home" to="/adminlogin">Admin Login</Link>
                        </li>
                    )}
                    {window.location.pathname === "/" && (
                        <li>
                            <Link className="game-home" to="/userlogin">Login</Link>
                        </li>
                    )}
                    {window.location.pathname === "/adminlogin" && (
                        <li>
                            <Link className="game-home" to="/userlogin">User Login</Link>
                        </li>
                    )}
                        
                </ul>
            </nav>
        </header>
        </>
    )
}
export default Header;