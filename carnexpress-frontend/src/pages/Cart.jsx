import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();
  const { items = [], total = 0, removeFromCart, updateQuantity } = useCart();

  const handleContinuarComprando = () => {
    navigate('/');
  };

  const handleProcederCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
        <h2>Tu carrito está vacío</h2>
        <p style={{ marginTop: '20px', fontSize: '16px' }}>
          ¡Agrega productos desde nuestro catálogo!
        </p>
        <button
          onClick={handleContinuarComprando}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
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
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: 'white', marginBottom: '20px' }}>
        🛒 Mi Carrito
      </h1>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        {items.map((item) => (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            borderBottom: '1px solid #eee'
          }}>
            {/* Imagen del producto */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
              {item.imagen?.url ? (
                <img
                  src={`http://localhost:1337${item.imagen.url}`}
                  alt={item.nombre}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
              ) : (
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  fontSize: '32px'
                }}>
                  🥩
                </div>
              )}
              
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{item.nombre}</h3>
                <p style={{ margin: 0, color: '#666' }}>
                  ${item.precio.toLocaleString('es-CO')} COP
                </p>
              </div>
            </div>

            {/* Controles de cantidad */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                  style={{
                    padding: '5px 12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px'
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
                    padding: '5px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div style={{ minWidth: '120px', textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: '#28a745' }}>
                  ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                </p>
              </div>

              {/* Botón Eliminar */}
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen y Total */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#666' }}>
            Total de productos: {items.reduce((sum, item) => sum + item.cantidad, 0)}
          </p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            TOTAL: <span style={{ color: '#28a745' }}>${total.toLocaleString('es-CO')} COP</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleContinuarComprando}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Continuar Comprando
          </button>

          <button
            onClick={handleProcederCheckout}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Proceder al Pago →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
