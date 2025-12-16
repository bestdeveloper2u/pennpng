import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('pngpoint_token');
    const savedUser = localStorage.getItem('pngpoint_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('pngpoint_token', authToken);
    localStorage.setItem('pngpoint_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pngpoint_token');
    localStorage.removeItem('pngpoint_user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('pngpoint_user', JSON.stringify(userData));
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';
  const isContributor = user?.role === 'contributor' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      updateUser,
      isAuthenticated,
      isAdmin,
      isContributor
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
