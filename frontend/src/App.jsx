import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import UserInfo from './pages/UserInfo.jsx';
import UpdateUserInfo from './pages/UpdateUserInfo.jsx';
import Home from './pages/Home.jsx';  // Import the Home component
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  return (
    <Router>
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
          element={<ProtectedRoute element={<Home />} />}  // Add the Home route here
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
