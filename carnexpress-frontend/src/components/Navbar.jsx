import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenuMovil = () => {
    setMenuMovilAbierto(!menuMovilAbierto);
  };

  const cerrarMenuMovil = () => {
    setMenuMovilAbierto(false);
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      padding: '0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Barra superior con redes sociales e información */}
      <div style={{
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px 0',
        fontSize: '13px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>📧 Instagram</span>
            <span>📘 Facebook</span>
            <span style={{ fontSize: '12px' }}>Por compras superiores a 60 mil lleva tu domicilio a 3 mil</span>
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
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'white'
          }}
        >
          <span style={{ fontSize: '40px' }}>🥩</span>
          <div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}>
              CARNEXPRESS
            </div>
            <div style={{
              fontSize: '11px',
              color: '#dc3545',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}>
              QUALITY MEAT
            </div>
          </div>
        </Link>

        {/* Menú desktop */}
        <div className="desktop-only" style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'center'
        }}>
          <Link
            to="/"
            style={{
              color: isActive('/') ? '#dc3545' : 'white',
              textDecoration: 'none',
              fontWeight: isActive('/') ? 'bold' : '500',
              fontSize: '15px',
              transition: 'color 0.3s',
              borderBottom: isActive('/') ? '2px solid #dc3545' : 'none',
              paddingBottom: '5px'
            }}
          >
            Inicio
          </Link>

          <Link
            to="/productos"
            style={{
              color: isActive('/productos') ? '#dc3545' : 'white',
              textDecoration: 'none',
              fontWeight: isActive('/productos') ? 'bold' : '500',
              fontSize: '15px',
              transition: 'color 0.3s',
              borderBottom: isActive('/productos') ? '2px solid #dc3545' : 'none',
              paddingBottom: '5px'
            }}
          >
            Productos
          </Link>

          <Link
            to="/ofertas"
            style={{
              color: isActive('/ofertas') ? '#dc3545' : 'white',
              textDecoration: 'none',
              fontWeight: isActive('/ofertas') ? 'bold' : '500',
              fontSize: '15px',
              transition: 'color 0.3s',
              borderBottom: isActive('/ofertas') ? '2px solid #dc3545' : 'none',
              paddingBottom: '5px'
            }}
          >
            Ofertas
          </Link>
        </div>

        {/* Acciones (carrito, perfil, admin, logout) */}
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          {/* Botón Usuario Desktop */}
          <button
            onClick={() => navigate('/mis-pedidos')}
            className="desktop-only"
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#1a1a1a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'white';
            }}
          >
            👤 {user?.username}
          </button>

          {/* Botón Carrito */}
          <button
            onClick={() => navigate('/cart')}
            style={{
              position: 'relative',
              padding: '10px 18px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🛒 Carrito
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ffc107',
                color: '#1a1a1a',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                border: '2px solid white'
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón Admin (solo si es admin) */}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="desktop-only"
              style={{
                padding: '10px 20px',
                backgroundColor: '#ffc107',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'transform 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              👑 Admin
            </button>
          )}

          {/* Botón Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="desktop-only"
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#5a6268';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#6c757d';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🚪 Salir
          </button>

          {/* Menú hamburguesa móvil */}
          <button
            onClick={toggleMenuMovil}
            className="menu-hamburguesa"
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              display: 'none'
            }}
          >
            {menuMovilAbierto ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuMovilAbierto && (
        <div
          className="menu-movil"
          style={{
            backgroundColor: '#2d2d2d',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            borderTop: '1px solid #444'
          }}
        >
          <Link
            to="/"
            onClick={cerrarMenuMovil}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: isActive('/') ? '#dc3545' : 'transparent',
              fontWeight: '500'
            }}
          >
            🏠 Inicio
          </Link>

          <Link
            to="/productos"
            onClick={cerrarMenuMovil}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: isActive('/productos') ? '#dc3545' : 'transparent',
              fontWeight: '500'
            }}
          >
            📦 Productos
          </Link>

          <Link
            to="/ofertas"
            onClick={cerrarMenuMovil}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: isActive('/ofertas') ? '#dc3545' : 'transparent',
              fontWeight: '500'
            }}
          >
            🔥 Ofertas
          </Link>

          <Link
            to="/mis-pedidos"
            onClick={cerrarMenuMovil}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: isActive('/mis-pedidos') ? '#dc3545' : 'transparent',
              fontWeight: '500'
            }}
          >
            👤 Mis Pedidos ({user?.username})
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={cerrarMenuMovil}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: '#ffc107',
                color: '#1a1a1a',
                fontWeight: 'bold'
              }}
            >
              👑 Panel Admin
            </Link>
          )}

          <button
            onClick={() => {
              cerrarMenuMovil();
              handleLogout();
            }}
            style={{
              padding: '12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              textAlign: 'left'
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
