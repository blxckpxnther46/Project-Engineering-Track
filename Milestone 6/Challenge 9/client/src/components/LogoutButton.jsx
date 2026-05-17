
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const LogoutButton = () => {
    const { logout, token } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // FIXED: Call server logout endpoint to blacklist token
            if(token) {
              await api.post('/auth/logout');
            }
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            // FIXED: Then clear frontend state
            logout();
            navigate('/login');
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: 'auto', padding: '0.5rem 1.25rem' }}>
            Logout
        </button>
    );
};

export default LogoutButton;
