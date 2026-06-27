import { useState } from 'react';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch {
                localStorage.removeItem('user');
            }
        }
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
            try {
                return JSON.parse(sessionUser);
            } catch {
                sessionStorage.removeItem('user');
            }
        }
        return null;
    });

    const login = (userData, remember = false) => {
        setUser(userData);
        if (remember) {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', userData.token);
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
        } else {
            sessionStorage.setItem('user', JSON.stringify(userData));
            sessionStorage.setItem('token', userData.token);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
