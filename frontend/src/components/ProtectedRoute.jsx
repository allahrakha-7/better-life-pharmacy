import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    // Check if user is authenticated (mock auth check)
    const isAuthenticated = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
