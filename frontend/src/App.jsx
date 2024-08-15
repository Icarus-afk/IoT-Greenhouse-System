import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import UserInfo from './pages/UserInfo.jsx';
import UpdateUserInfo from './pages/UpdateUserInfo.jsx';
import Home from './pages/Home.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import NotificationsPage from './pages/NotificationPage.jsx';
import PasswordResetRequest from './pages/PasswordResetRequest.jsx';
import PasswordResetForm from './pages/PasswordResetForm.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const NavbarWithLocation = () => {
    const location = useLocation();
    return (
      <>
        {isAuthenticated !== null && ['/home', '/user-info', '/update-user-info', '/notifications'].includes(location.pathname) && (
          <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        )}
      </>
    );
  };

  if (isAuthenticated === null) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <NavbarWithLocation />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user-info" element={<ProtectedRoute element={<UserInfo />} />} />
        <Route path="/update-user-info" element={<ProtectedRoute element={<UpdateUserInfo />} />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/notifications" element={<ProtectedRoute element={<NotificationsPage />} />} />
        <Route path="/reset-password-req" element={<PasswordResetRequest />} />
        <Route path="/reset-password/:uid/:token" element={<PasswordResetForm />} />
        <Route path="/" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
};

export default App;