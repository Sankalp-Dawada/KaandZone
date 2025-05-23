import React, { useState } from 'react';
import Header from '../components/Header';
import '../styles/Login.css';

function AdminLogin(){
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    return(
        <>
            <Header />
            <div className="background-effects">
                <div className="grid-overlay"></div>
                </div>
            <div className="content-wrapper">
                <div className='flex-column'>
                    <form>
                    <h1>Admin Login</h1>
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
                        <div className='flex-row'>
                            <label htmlFor="password">Password:</label>
                            <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <label htmlFor="Enter Username" hidden>Enter Username</label>
                        <button
                            className='login'
                            type="button"
                            onClick={() => {
                                if (username.trim() === 'admin' && password.trim() === 'admin')
                                    window.location.href = '/home';
                                else if (username.trim() === '' && password.trim() === '')
                                    alert('Please enter a username and password');
                                else alert('Username or Password incorrect');
                            }}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AdminLogin;