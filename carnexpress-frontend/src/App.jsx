import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogo from './pages/Catalogo';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import './App.css';

// Componente para proteger rutas
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Catalogo />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              } 
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
