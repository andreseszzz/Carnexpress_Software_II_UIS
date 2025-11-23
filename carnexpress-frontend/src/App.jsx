import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';
import AdminPanel from './pages/AdminPanel';
import Informes from './pages/Informes';
import GestionProductos from './pages/GestionProductos';
import './App.css';

// Componente para proteger rutas
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Navbar />
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas protegidas - Cliente */}
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/productos" 
                element={
                  <PrivateRoute>
                    <Catalogo />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/ofertas" 
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
                path="/mis-pedidos" 
                element={
                  <PrivateRoute>
                    <MisPedidos />
                  </PrivateRoute>
                } 
              />
              
              {/* Rutas protegidas - Admin */}
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <AdminPanel />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/informes" 
                element={
                  <PrivateRoute>
                    <Informes />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/productos" 
                element={
                  <PrivateRoute>
                    <GestionProductos />
                  </PrivateRoute>
                } 
              />
              
              {/* Ruta por defecto - redirige a home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
