import { doc, setDoc } from "firebase/firestore";
import Header from "../components/Header";
import { db } from "../services/firebase";
// import "../styles/Home.css";
import "../styles/Login.css";
import { useState } from "react";
import type { User } from "../types";
function UserLogin() {
    const [username, setUsername] = useState<string>('');
    return (
        <>
            <Header />
            <div className="background-effects">
                <div className="grid-overlay"></div>
            </div>
            <div className="content-wrapper">
                <div className='login-column'>
                    <header className='login-header'>User Login</header>
                    <form>
                        <div className='login-row'>
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
                        {/* <label htmlFor="Enter Username" hidden>Enter Username</label> */}
                        <div className="login-button">
                            <button
                                className='login'
                                type="button"
                                onClick={async () => {
                                    if (username.trim() !== '') {
                                        try {
                                            const user: User = {
                                                username,
                                                roomId: [],
                                                gameType: [],
                                                isHost: false,
                                                setPlayerPoints: [],
                                                PlayersName: [],
                                            };

                                            await setDoc(doc(db, 'users', user.username), user, { merge: true });
                                            localStorage.setItem('username', user.username);
                                            window.location.href = '/';
                                        } catch (e) {
                                            console.error("Error adding document: ", e);
                                            alert('Error adding document: ' + e);
                                        }
                                    } else {
                                        alert('Please enter a username');
                                    }
                                }}
                            >
                                Login
                            </button>

                        </div>
                    </form>
                </div>

            </div>

        </>
    )
}
export default UserLogin;