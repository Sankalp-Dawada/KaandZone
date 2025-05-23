import Header from "../components/Header";
// import "../styles/Home.css";
import "../styles/Login.css";
import { useState } from "react";
function UserLogin() {
    const [username, setUsername] = useState<string>('');
    return (
        <>
            <Header />
            <div className="background-effects">
                <div className="grid-overlay"></div>
            </div>
            <div className="content-wrapper">
                <div className='flex-column'>
                    <h1>User Login</h1>
                    <form>
                        <div className='flex-row'>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <label htmlFor="Enter Username" hidden>Enter Username</label>
                        <button
                            className='login'
                            type="button"
                            onClick={() => {
                                if (username.trim() !== '')
                                    window.location.href = '/home';
                                else alert('Please enter a username');
                            }}>
                            Login
                        </button>
                    </form>
                </div>

            </div>

        </>
    )
}
export default UserLogin;