import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { crearPedido, crearDetallePedido } from '../api/strapi';

function Checkout() {
  const navigate = useNavigate();
  const { items = [], total = 0, clearCart } = useCart();
  const { user, token } = useAuth();

  const [formulario, setFormulario] = useState({
    direccion: '',
    telefono: '',
    notas: ''
  });

  const [procesando, setProcesando] = useState(false);

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    setProcesando(true);

    try {
      // 1. Crear el pedido
      const pedidoData = {
        total: total,
        estado: 'solicitado',
        direccion_entrega: formulario.direccion,
        telefono_contacto: formulario.telefono,
        notas: formulario.notas,
        cliente: user.id
      };

      console.log('Creando pedido con:', pedidoData);
      const pedidoCreado = await crearPedido(pedidoData, token);
      console.log('✅ Pedido creado:', pedidoCreado);

      // 2. Crear los detalles del pedido
      for (const item of items) {
        const detalleData = {
          cantidad: item.cantidad,
          subtotal: item.precio * item.cantidad,
          pedido: pedidoCreado.data.id,
          producto: item.id
        };

        console.log('Creando detalle con:', detalleData);
        
        try {
          await crearDetallePedido(detalleData, token);
          console.log('✅ Detalle creado para:', item.nombre);
        } catch (error) {
          console.error('❌ Error al crear detalle para:', item.nombre, error);
        }
      }

      // 3. Limpiar carrito y redirigir
      clearCart();
      alert('✅ Pedido realizado exitosamente! Te contactaremos pronto.');
      navigate('/mis-pedidos');

    } catch (error) {
      console.error('❌ Error al procesar pedido:', error);
      alert('❌ Error al procesar el pedido. Por favor intenta nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
        <h2>Tu carrito está vacío</h2>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
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
        🛒 Finalizar Compra
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Formulario de Datos */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0 }}>Datos de Entrega</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Dirección de Entrega *
              </label>
              <input
                type="text"
                name="direccion"
                value={formulario.direccion}
                onChange={handleChange}
                required
                placeholder="Calle 123 #45-67, Barrio, Ciudad"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Teléfono de Contacto *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formulario.telefono}
                onChange={handleChange}
                required
                placeholder="3001234567"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Notas Adicionales (opcional)
              </label>
              <textarea
                name="notas"
                value={formulario.notas}
                onChange={handleChange}
                rows="4"
                placeholder="Instrucciones especiales para la entrega..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={procesando}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: procesando ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: procesando ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {procesando ? 'Procesando...' : '✅ Confirmar Pedido'}
            </button>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h2 style={{ marginTop: 0 }}>Resumen del Pedido</h2>
          
          <div style={{ marginBottom: '20px' }}>
            {items.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '15px 0',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                    {item.nombre}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    Cantidad: {item.cantidad}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#28a745' }}>
                    ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '2px solid #333',
            paddingTop: '15px',
            marginTop: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                TOTAL:
              </span>
              <span style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#28a745'
              }}>
                ${total.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#666'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
              📦 Información de Entrega:
            </p>
            <p style={{ margin: '5px 0' }}>
              • Tiempo estimado: 1-2 días hábiles
            </p>
            <p style={{ margin: '5px 0' }}>
              • Te contactaremos para coordinar la entrega
            </p>
            <p style={{ margin: '5px 0' }}>
              • Pago contra entrega
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
