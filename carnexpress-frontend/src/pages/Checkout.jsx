import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { crearPedido, crearDetallePedido } from '../api/strapi';
import '../styles/Checkout.css';

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
    <div className="checkout-container">
      <h1 className="checkout-title">🛒 Finalizar Compra</h1>

      <div className="checkout-grid">
        <div className="checkout-form-card">
          <h2>Datos de Entrega</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Dirección de Entrega *</label>
              <input
                type="text"
                name="direccion"
                value={formulario.direccion}
                onChange={handleChange}
                required
                placeholder="Calle 123 #45-67, Barrio, Ciudad"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono de Contacto *</label>
              <input
                type="tel"
                name="telefono"
                value={formulario.telefono}
                onChange={handleChange}
                required
                placeholder="3001234567"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notas Adicionales (opcional)</label>
              <textarea
                name="notas"
                value={formulario.notas}
                onChange={handleChange}
                rows="4"
                placeholder="Instrucciones especiales para la entrega..."
                className="form-textarea"
              />
            </div>

            <button type="submit" disabled={procesando} className="btn-submit">
              {procesando ? 'Procesando...' : '✅ Confirmar Pedido'}
            </button>
          </form>
        </div>

        <div className="checkout-summary-card">
          <h2>Resumen del Pedido</h2>
          
          <div className="summary-items">
            {items.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-info">
                  <p>{item.nombre}</p>
                  <p className="summary-item-quantity">Cantidad: {item.cantidad}</p>
                </div>
                <div className="summary-item-price">
                  <p>${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-total-section">
            <span className="summary-total-label">TOTAL:</span>
            <span className="summary-total-amount">
              ${total.toLocaleString('es-CO')} COP
            </span>
          </div>

          <div className="delivery-info">
            <p className="delivery-title">📦 Información de Entrega:</p>
            <p>• Tiempo estimado: 1-2 días hábiles</p>
            <p>• Te contactaremos para coordinar la entrega</p>
            <p>• Pago contra entrega</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
