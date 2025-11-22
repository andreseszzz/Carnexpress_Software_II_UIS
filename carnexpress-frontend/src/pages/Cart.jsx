import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>
          Tu carrito está vacío
        </h2>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Ir al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: 'white', marginBottom: '30px' }}>
        🛒 Mi Carrito
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>
        {/* Lista de Productos */}
        <div>
          {cartItems.map((item) => (
            <div key={item.id} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '15px',
              display: 'grid',
              gridTemplateColumns: '100px 1fr auto',
              gap: '20px',
              alignItems: 'center'
            }}>
              {/* Imagen */}
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {item.imagen && item.imagen.url ? (
                  <img 
                    src={`http://localhost:1337${item.imagen.url}`}
                    alt={item.nombre}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '36px' }}>🥩</div>
                )}
              </div>

              {/* Info del Producto */}
              <div>
                <h3 style={{ margin: '0 0 10px 0' }}>{item.nombre}</h3>
                <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px', margin: '5px 0' }}>
                  ${item.precio.toLocaleString('es-CO')} COP
                </p>
                <p style={{ color: '#666', textTransform: 'capitalize', margin: '5px 0' }}>
                  Categoría: {item.categoria}
                </p>
              </div>

              {/* Controles */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'center'
              }}>
                {/* Cantidad */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 'bold', fontSize: '18px', minWidth: '30px', textAlign: 'center' }}>
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <p style={{ fontWeight: 'bold', margin: '5px 0' }}>
                  ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                </p>

                {/* Eliminar */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    padding: '5px 15px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del Pedido */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          height: 'fit-content',
          position: 'sticky',
          top: '20px'
        }}>
          <h3 style={{ marginTop: 0 }}>Resumen del Pedido</h3>
          
          <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px', marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Subtotal:</span>
              <span>${getCartTotal().toLocaleString('es-CO')} COP</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Envío:</span>
              <span style={{ color: '#28a745' }}>Gratis</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '15px',
              paddingTop: '15px',
              borderTop: '2px solid #333',
              fontWeight: 'bold',
              fontSize: '20px'
            }}>
              <span>Total:</span>
              <span style={{ color: '#dc3545' }}>
                ${getCartTotal().toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '20px'
            }}
          >
            Proceder al Pago
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'white',
              color: '#dc3545',
              border: '2px solid #dc3545',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            Seguir Comprando
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                clearCart();
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'transparent',
              color: '#6c757d',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '10px',
              textDecoration: 'underline'
            }}
          >
            Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
