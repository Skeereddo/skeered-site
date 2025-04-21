import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const email = localStorage.getItem('user_email');

      if (token && email) {
        try {
          const response = await fetch(
            'https://misty-frog-d87f.zucconichristian36.workers.dev/api/auth/verify',
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include'
            }
          );

          if (response.ok) {
            setUser({ email, token });
          } else {
            // Token is invalid, clear storage
            logout();
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (email, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_email', email);
    setUser({ email, token });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 