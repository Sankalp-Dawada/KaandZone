import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import CreateRoom from './pages/CreateRoom';
import Room from './pages/Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;