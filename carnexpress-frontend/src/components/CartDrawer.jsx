import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartDrawer({ isOpen, onClose }) {
  const { items, total, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.3s'
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        maxWidth: '400px',
        height: '100vh',
        backgroundColor: 'white',
        zIndex: 1000,
        boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#dc3545',
          color: 'white'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>🛒 Mi Carrito</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '30px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px'
        }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <p style={{ fontSize: '48px', margin: 0 }}>🛒</p>
              <p style={{ color: '#666', marginTop: '10px' }}>Tu carrito está vacío</p>
              <p style={{ color: '#999', fontSize: '14px', marginTop: '5px' }}>
                Agrega productos para comenzar tu compra
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {items.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  gap: '15px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  {/* Imagen */}
                  {item.imagen?.url ? (
                    <img
                      src={`http://localhost:1337${item.imagen.url}`}
                      alt={item.nombre}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#e9ecef',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      🥩
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                      {item.nombre}
                    </h4>
                    <p style={{ margin: '0 0 10px 0', color: '#28a745', fontWeight: 'bold' }}>
                      ${item.precio.toLocaleString()}
                    </p>

                    {/* Controles de cantidad */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          border: '1px solid #ddd',
                          background: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          border: '1px solid #ddd',
                          background: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '20px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid #eee',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px',
              fontSize: '14px',
              color: '#666'
            }}>
              <span>Subtotal:</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              fontSize: '14px',
              color: '#666'
            }}>
              <span>Envío:</span>
              <span>$5.000</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              <span>Total:</span>
              <span style={{ color: '#28a745' }}>${(total + 5000).toLocaleString()}</span>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              💳 PROCEDER AL PAGO
            </button>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: '#6c757d',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

export default CartDrawer;
