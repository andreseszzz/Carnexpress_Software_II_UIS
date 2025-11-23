import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
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
import Ofertas from './pages/Ofertas';
import './App.css';

// Componente de ruta protegida
function PrivateRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: user ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'
    }}>
      {user && <Navbar />}
      
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        {/* Rutas protegidas (requieren login) */}
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
              <Ofertas />
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

        {/* Rutas de administrador */}
        <Route 
          path="/admin" 
          element={
            <PrivateRoute adminOnly={true}>
              <AdminPanel />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/informes" 
          element={
            <PrivateRoute adminOnly={true}>
              <Informes />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/productos" 
          element={
            <PrivateRoute adminOnly={true}>
              <GestionProductos />
            </PrivateRoute>
          } 
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
