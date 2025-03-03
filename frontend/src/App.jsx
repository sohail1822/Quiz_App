import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from './redux/userSlice';
import './App.css';
import Navbar from './components/Navbar';
import Snackbar from './components/Snackbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import CreateQuiz from './pages/CreateQuiz';
import AddQuestion from './pages/AddQuestion';
import QuizManagement from './pages/QuizManagement';
import UserDashboard from './pages/UserDashboard';
import QuizAttempt from './pages/QuizAttempt';
import QuizResult from './pages/QuizResult';
import ParticipantReport from './pages/ParticipantReport';
import UserResponse from './pages/UserResponse';



const RequireAuth = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log(user);
  
  if(user?.is_admin){
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

const RequireAdmin = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!user?.is_admin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem('access-token');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/user/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(loginSuccess({ user: data }));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/quiz/attempt/:id" element={<QuizAttempt />} />
          <Route path="/quiz/result/:id" element={<QuizResult />} />
        </Route>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/create-quiz" element={<CreateQuiz />} />
            <Route path="/admin/add-question/:quizId" element={<AddQuestion />} />
            <Route path="/admin/manage-quizzes" element={<QuizManagement />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/participants/:quizId" element={<ParticipantReport />} />
            <Route path="/quiz/:quizId/participant/:participantId" element={<UserResponse />} />

          </Route>
      </Routes>
      <Snackbar />
    </BrowserRouter>
  );
}

export default App;