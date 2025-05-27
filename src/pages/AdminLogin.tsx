import { useState } from 'react';
import Header from '../components/Header';
import '../styles/Login.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function AdminLogin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      alert('Please enter an email and password');
      return;
    }

    try {
      const docRef = doc(db, 'AdminLogin', 'SankalpDawada');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (email.trim() === data.Email && password.trim() === data.Password) {
          localStorage.setItem('isAdmin', 'true');
          window.location.href = '/';
        } else {
          alert('Email or Password incorrect');
        }
      } else {
        alert('No such admin found');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Something went wrong during login');
    }
  };

  return (
    <>
      <Header />
      <div className="background-effects">
        <div className="grid-overlay"></div>
      </div>
      <div className="content-wrapper">
        <div className="login-column">
          <header className='login-header'>Admin Login</header>
          <div className="login-row">
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-row">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='login-button'>
          <button className="login" type="button" onClick={handleLogin}>
            Login
          </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
