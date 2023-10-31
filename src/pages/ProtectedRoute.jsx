import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/contexts/AuthContext';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  return children;
}

export default ProtectedRoute;
