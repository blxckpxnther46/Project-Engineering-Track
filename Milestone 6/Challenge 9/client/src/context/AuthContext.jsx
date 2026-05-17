
import { createContext, useContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(null);

  useEffect(() => {
    if(token) {
      try {
        // FIXED: Decode role from JWT token instead of localStorage
        const decoded = jwt_decode(token);
        setRole(decoded.role);
        setUser({ token, role: decoded.role });
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
        setToken(null);
        setRole(null);
        setUser(null);
      }
    }
  }, [token]);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    // FIXED: Don't store role in localStorage - it's decoded from JWT
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
