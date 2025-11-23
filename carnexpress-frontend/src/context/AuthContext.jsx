import { createContext, useState, useContext, useEffect } from 'react';
import { loginUsuario, registrarUsuario } from '../api/strapi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (identifier, password) => {
    try {
      const data = await loginUsuario(identifier, password);
      setToken(data.jwt);
      setUser(data.user);
      
      // Guardar en localStorage
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Error al iniciar sesión'
      };
    }
  };

  // Registro
  const register = async (userData) => {
    try {
      const data = await registrarUsuario(userData);
      setToken(data.jwt);
      setUser(data.user);
      
      // Guardar en localStorage
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Error al registrar usuario'
      };
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return user?.isAdmin === true;
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isAdmin: isAdmin()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
