import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { crearPedido, crearDetallePedido } from '../api/strapi';

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    direccion: user?.direccion || '',
    telefono: user?.telefono || '',
    notas: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.direccion || !formData.telefono) {
      setError('Por favor completa la dirección y teléfono');
      return;
    }

    if (cartItems.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const total = getCartTotal();

      // Crear el pedido principal
      const pedidoData = {
        usuario: user.id,
        estado: 'pendiente',
        total: total,
        direccion_entrega: formData.direccion,
        telefono_contacto: formData.telefono,
        notas: formData.notas || null
      };

      const pedidoResponse = await crearPedido(pedidoData, token);
      const pedidoId = pedidoResponse.data.id;

      // Crear los detalles del pedido (cada producto)
      const detallesPromises = cartItems.map(item => {
        const detalleData = {
          pedido: pedidoId,
          producto: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad
        };
        return crearDetallePedido(detalleData, token);
      });

      await Promise.all(detallesPromises);

      // Limpiar el carrito
      clearCart();

      // Redirigir a página de confirmación
      alert('✅ ¡Pedido realizado con éxito! Número de pedido: ' + pedidoId);
      navigate('/');
      
    } catch (error) {
      console.error('Error al procesar pedido:', error);
      setError('Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
          No tienes productos en el carrito
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
        📦 Confirmar Pedido
      </h1>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        {/* Formulario de Datos */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px'
        }}>
          <h2 style={{ marginTop: 0 }}>Datos de Entrega</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Dirección de Entrega *
              </label>
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Calle 123 #45-67, Apartamento 301, Bogotá"
                required
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Teléfono de Contacto *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="3001234567"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Notas adicionales (opcional)
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                placeholder="Ej: Tocar el timbre dos veces, entregar después de las 3pm..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: loading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {loading ? 'Procesando...' : '✅ Confirmar Pedido'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/cart')}
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
              Volver al Carrito
            </button>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0 }}>Resumen del Pedido</h3>
            
            {cartItems.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                    {item.nombre}
                  </p>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    Cantidad: {item.cantidad} × ${item.precio.toLocaleString('es-CO')}
                  </p>
                </div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>
                  ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                </p>
              </div>
            ))}

            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '2px solid #333'
            }}>
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
                fontSize: '20px',
                fontWeight: 'bold',
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid #ddd'
              }}>
                <span>Total:</span>
                <span style={{ color: '#dc3545' }}>
                  ${getCartTotal().toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
              ℹ️ Al confirmar tu pedido, recibirás una notificación con el número de seguimiento.
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              🚚 Tiempo estimado de entrega: 24-48 horas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
