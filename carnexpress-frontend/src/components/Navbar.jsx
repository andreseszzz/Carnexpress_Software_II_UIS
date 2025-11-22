import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = getCartCount();

  return (
    <nav style={{
      backgroundColor: '#dc3545',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h2 style={{ color: 'white', margin: 0, cursor: 'pointer' }}
            onClick={() => navigate('/')}>
          🥩 Carnexpress
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {isAuthenticated ? (
          <>
            {/* Icono del Carrito */}
            <button 
              onClick={() => navigate('/cart')}
              style={{
                position: 'relative',
                padding: '8px 16px',
                backgroundColor: 'white',
                color: '#dc3545',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '20px'
              }}
            >
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#ffc107',
                  color: '#000',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Botón Mis Pedidos */}
            <button 
              onClick={() => navigate('/mis-pedidos')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📦 Mis Pedidos
            </button>

            <span style={{ color: 'white', fontWeight: 'bold' }}>
              {isAdmin ? '👑 Admin' : '👤'} Hola, {user?.username || user?.nombre || 'Usuario'}
            </span>
            
            {isAdmin && (
              <button onClick={() => navigate('/admin')} style={{
                padding: '8px 16px',
                backgroundColor: '#ffc107',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Panel Admin
              </button>
            )}
            
            <button onClick={handleLogout} style={{
              padding: '8px 16px',
              backgroundColor: 'white',
              color: '#dc3545',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} style={{
              padding: '8px 16px',
              backgroundColor: 'white',
              color: '#dc3545',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Iniciar Sesión
            </button>
            <button onClick={() => navigate('/register')} style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Registrarse
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
