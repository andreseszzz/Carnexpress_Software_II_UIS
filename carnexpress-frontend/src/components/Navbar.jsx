import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuMovilOpen, setMenuMovilOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <>
      <nav style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        {/* Barra superior */}
        <div style={{
          backgroundColor: '#000',
          padding: '8px 0',
          fontSize: '13px'
        }} className="desktop-only">
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>
                📷 Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>
                📘 Facebook
              </a>
            </div>
            <div style={{ color: '#ccc' }}>
              Por compras superiores a 60 mil lleva tu domicilio a 3 mil
            </div>
          </div>
        </div>

        {/* Navbar principal */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              backgroundColor: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🥩
            </div>
            <div className="desktop-only">
              <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', lineHeight: 1 }}>
                CARNEXPRESS
              </div>
              <div style={{ color: '#dc3545', fontSize: '11px', letterSpacing: '2px' }}>
                QUALITY MEAT
              </div>
            </div>
          </Link>

          {/* Menú hamburguesa (móvil) */}
          <button
            onClick={() => setMenuMovilOpen(!menuMovilOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '28px',
              cursor: 'pointer',
              padding: 0
            }}
            className="menu-hamburguesa"
          >
            ☰
          </button>

          {/* Menú central (desktop) */}
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="desktop-only">
            <Link 
              to="/" 
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                borderBottom: isActive('/') ? '2px solid #dc3545' : '2px solid transparent',
                paddingBottom: '5px',
                transition: 'border-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.borderBottom = '2px solid #dc3545'}
              onMouseLeave={(e) => e.target.style.borderBottom = isActive('/') ? '2px solid #dc3545' : '2px solid transparent'}
            >
              Inicio
            </Link>
            <Link 
              to="/productos" 
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                borderBottom: isActive('/productos') ? '2px solid #dc3545' : '2px solid transparent',
                paddingBottom: '5px',
                transition: 'border-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.borderBottom = '2px solid #dc3545'}
              onMouseLeave={(e) => e.target.style.borderBottom = isActive('/productos') ? '2px solid #dc3545' : '2px solid transparent'}
            >
              Productos
            </Link>
            <Link 
              to="/ofertas" 
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                borderBottom: isActive('/ofertas') ? '2px solid #dc3545' : '2px solid transparent',
                paddingBottom: '5px',
                transition: 'border-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.borderBottom = '2px solid #dc3545'}
              onMouseLeave={(e) => e.target.style.borderBottom = isActive('/ofertas') ? '2px solid #dc3545' : '2px solid transparent'}
            >
              Ofertas
            </Link>
          </div>

          {/* Acciones derecha */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Icono de usuario (desktop) */}
            <div 
              style={{ position: 'relative', cursor: 'pointer' }}
              className="desktop-only"
              onClick={() => navigate('/mis-pedidos')}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#dc3545',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                👤
              </div>
            </div>

            {/* Carrito */}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                fontSize: '24px',
                padding: 0
              }}
            >
              🛒
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {itemCount}
                </span>
              )}
            </button>

            {isAdmin && (
              <Link to="/admin" style={{
                padding: '8px 16px',
                backgroundColor: '#ffc107',
                color: '#000',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
              className="desktop-only">
                👑 Admin
              </Link>
            )}
          </div>
        </div>

        {/* Menú móvil */}
        {menuMovilOpen && (
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '20px',
            display: 'none'
          }}
          className="menu-movil">
            <Link 
              to="/" 
              onClick={() => setMenuMovilOpen(false)}
              style={{
                display: 'block',
                color: 'white',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid #444',
                fontWeight: '500'
              }}
            >
              Inicio
            </Link>
            <Link 
              to="/productos" 
              onClick={() => setMenuMovilOpen(false)}
              style={{
                display: 'block',
                color: 'white',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid #444',
                fontWeight: '500'
              }}
            >
              Productos
            </Link>
            <Link 
              to="/ofertas" 
              onClick={() => setMenuMovilOpen(false)}
              style={{
                display: 'block',
                color: 'white',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid #444',
                fontWeight: '500'
              }}
            >
              Ofertas
            </Link>
            <Link 
              to="/mis-pedidos" 
              onClick={() => setMenuMovilOpen(false)}
              style={{
                display: 'block',
                color: 'white',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid #444',
                fontWeight: '500'
              }}
            >
              Mis Pedidos
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                onClick={() => setMenuMovilOpen(false)}
                style={{
                  display: 'block',
                  color: '#ffc107',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid #444',
                  fontWeight: '500'
                }}
              >
                👑 Admin
              </Link>
            )}
            <button
              onClick={() => {
                handleLogout();
                setMenuMovilOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                color: 'white',
                padding: '12px 0',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;
