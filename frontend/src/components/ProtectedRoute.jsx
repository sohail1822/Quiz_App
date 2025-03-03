import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useSelector((state) => state.user);

  useEffect(()=>{
    console.log(user);
  },[])

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.isAdmin) {
    // Redirect non-admin users to the dashboard
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
