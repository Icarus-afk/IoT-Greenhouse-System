// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import UserInfo from './pages/UserInfo.jsx';
import UpdateUserInfo from './pages/UpdateUserInfo.jsx';
import Home from './pages/Home.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('jwt');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    // Clear everything in local storage
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const NavbarWithLocation = () => {
    const location = useLocation();
    return (
      <>
        {['/home', '/user-info', '/update-user-info'].includes(location.pathname) && (
          <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        )}
      </>
    );
  };

  return (
    <Router>
      <NavbarWithLocation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/user-info"
          element={<ProtectedRoute element={<UserInfo />} />}
        />
        <Route
          path="/update-user-info"
          element={<ProtectedRoute element={<UpdateUserInfo />} />}
        />
        <Route
          path="/home"
          element={<ProtectedRoute element={<Home />} />}
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
